var domain = require("domain");
var Message = require("../message");
var HttpStatusCode = require("../httpStatusCode");
var FaultError = require("../faultError");
var CallbackUtil = require("../common/callbackUtil");
var OperationContext = require("../operationContext");
var RequestHandler = (function () {
    function RequestHandler(endpoint, request) {
        this.message = request.message;
        this._endpoint = endpoint;
        this._request = request;
    }
    /**
     * Process the request.
     * @param callback Called when processing completes.
     */
    RequestHandler.prototype.process = function (callback) {
        var _this = this;
        if (this._callback) {
            throw new Error("Process called multiple times.");
        }
        if (!callback) {
            throw new Error("Missing required argument 'callback'.");
        }
        this._callback = callback;
        if (!this._endpoint.service.operationContextRequired) {
            this._handleRequest();
        }
        else {
            var d = domain.create();
            d.on('error', function (err) { return _this._handleUncaughtException(err); });
            d.run(function () {
                var context = new OperationContext();
                context.requestContext = _this;
                OperationContext.current = context;
                _this._handleRequest();
            });
        }
    };
    RequestHandler.prototype._handleRequest = function () {
        var _this = this;
        this._afterReceiveRequest();
        var operation = this._endpoint.chooseOperation(this.message);
        if (!operation) {
            this._handleError(new Error("Unable to choose operation."));
            return;
        }
        operation.formatter.deserializeRequest(this.message, function (err, args) {
            if (err)
                return _this._handleError(err);
            _this._invoke(operation, args);
        });
    };
    /**
     * Reply to the request.
     * @param message The message to send as a reply.
     */
    RequestHandler.prototype.reply = function (message) {
        if (this._finished)
            return;
        this._finished = true;
        this._beforeSendReply(message);
        this._request.reply(message);
        this._callback();
    };
    /**
     * Abort the request without normal error handling.
     */
    RequestHandler.prototype.abort = function () {
        if (this._finished)
            return;
        this._finished = true;
        this._request.abort();
        this._callback();
    };
    RequestHandler.prototype._afterReceiveRequest = function () {
        var messageInspectors = this._endpoint.messageInspectors;
        if (!messageInspectors || messageInspectors.length == 0)
            return;
        this._correlationStates = new Array(messageInspectors.length);
        for (var i = 0; i < messageInspectors.length; i++) {
            this._correlationStates[i] = messageInspectors[i].afterReceiveRequest(this.message);
        }
    };
    RequestHandler.prototype._beforeSendReply = function (reply) {
        if (!this._correlationStates)
            return;
        var messageInspectors = this._endpoint.messageInspectors;
        for (var i = 0; i < messageInspectors.length; i++) {
            messageInspectors[i].beforeSendReply(reply, this._correlationStates[i]);
        }
    };
    RequestHandler.prototype._invoke = function (operation, args) {
        var _this = this;
        var instance = this._endpoint.service.instanceProvider.getInstance(this.message);
        operation.invoker.invoke(instance, args, function (err, result) {
            if (err)
                return _this._handleError(err);
            // No need to serialize the reply if this is a one way message.
            if (operation.isOneWay)
                return;
            operation.formatter.serializeReply(result, function (err, message) {
                if (err)
                    return _this._handleError(err);
                _this.reply(message);
            });
        });
        // If this is a one-way operation then reply immediately. We don't wait for the callback from invoke. Note
        // that this means that errors as a result of the invoke will not be reported to the client.
        if (operation.isOneWay) {
            this.reply(Message.createReply(200 /* Ok */));
        }
    };
    RequestHandler.prototype._handleUncaughtException = function (err) {
        // Emit the error from the dispatcher.
        this._endpoint.service.dispatcher.emit('error', err);
        // The default behavior will crash the process immediately once the error is emitted. However, if the host
        // handles the event and gives us a chane to shutdown, process the error.
        if (this._errored) {
            // The uncaught exception occurred while in the error handler. Nothing else we can do but abort.
            this._endpoint.service.dispatcher.logger.trace(err, "Uncaught exception in error handler. Aborting request.");
            this.abort();
        }
        else {
            // Give error handlers a chance to process the error for logging, etc.
            this._handleError(err);
        }
    };
    RequestHandler.prototype._handleError = function (err) {
        var _this = this;
        // Make sure the error handlers are just executed once. For example, _handleError could be called multiple
        // times if an exception occurs which is caught by the domain and passed to _handleError and then the timeout
        // for the operation invoker fires.
        if (this._errored || this._finished)
            return;
        this._errored = true;
        var step = -1;
        var next = function (e) {
            var handler = _this._endpoint.errorHandlers[++step];
            if (handler) {
                handler.handleError(e, _this, CallbackUtil.onlyOnce(next));
            }
            else {
                // We've reached the end of the error handler chain. Send a reply.
                _this._sendFault(e);
            }
        };
        next(err);
    };
    RequestHandler.prototype._sendFault = function (err) {
        var _this = this;
        var fault;
        if (FaultError.isFaultError(err)) {
            fault = err;
        }
        else {
            // If the error is not a FaultError, then create one. By default we return a generic message that does not
            // include any details about the error.
            if (!this._endpoint.includeErrorDetailInFault) {
                fault = new FaultError(null, "The server was unable to process the request due to an internal error.", "InternalError");
            }
            else {
                fault = new FaultError(err.stack, err.message, "InternalError");
            }
        }
        this._endpoint.faultFormatter.serializeFault(fault, function (err, message) {
            // If we get an error while trying to serialize the fault then we can't reply with the error so abort request and log the error.
            if (err) {
                if (err) {
                    _this._endpoint.service.dispatcher.logger.error({ err: err, endpoint: _this._endpoint }, "Error serializing fault. Aborting request.");
                }
                return _this.abort();
            }
            _this.reply(message);
        });
    };
    return RequestHandler;
})();
module.exports = RequestHandler;
