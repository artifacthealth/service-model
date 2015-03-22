/// <reference path="../../typings/node.d.ts" />

import domain = require("domain");

import DispatchEndpoint = require("./dispatchEndpoint");
import DispatchOperation = require("./dispatchOperation");
import RequestContext = require("../requestContext");
import Message = require("../message");
import HttpStatusCode = require("../httpStatusCode");
import FaultError = require("../faultError");
import Callback = require("../common/callback");
import CallbackUtil = require("../common/callbackUtil");
import OperationContext = require("../operationContext");

class RequestHandler implements RequestContext {

    private _endpoint: DispatchEndpoint;
    private _request: RequestContext;
    private _correlationStates: any[];
    private _finished: boolean;
    private _callback: () => void;
    private _errored: boolean;

    message: Message;
    prev: RequestHandler;
    next: RequestHandler;

    constructor(endpoint: DispatchEndpoint, request: RequestContext) {

        this.message = request.message;
        this._endpoint = endpoint;
        this._request = request;
    }

    /**
     * Process the request.
     * @param callback Called when processing completes.
     */
    process(callback: () => void): void {

        if(this._callback) {
            throw new Error("Process called multiple times.");
        }

        if(!callback) {
            throw new Error("Missing required argument 'callback'.");
        }
        this._callback = callback;

        if(!this._endpoint.service.operationContextRequired) {
            this._handleRequest();
        }
        else {
            var d = domain.create();
            d.on('error', (err: Error) => this._handleUncaughtException(err));
            d.run(() => {
                var context = new OperationContext();
                context.requestContext = this;
                OperationContext.current = context;
                this._handleRequest();
            });
        }
    }

    private _handleRequest(): void {
        this._afterReceiveRequest();

        var operation = this._endpoint.chooseOperation(this.message);
        if (!operation) {
            this._handleError(new Error("Unable to choose operation"));
            return;
        }

        operation.formatter.deserializeRequest(this.message, (err, args) => {
            if (err) return this._handleError(err);
            this._invoke(operation, args);
        });
    }

    /**
     * Reply to the request.
     * @param message The message to send as a reply.
     */
    reply(message?: Message): void {

        if(this._finished) return;
        this._finished = true;

        this._beforeSendReply(message);
        this._request.reply(message);
        this._callback();
    }

    /**
     * Abort the request without normal error handling.
     */
    abort(): void {

        if(this._finished) return;
        this._finished = true;

        this._request.abort();
        this._callback();
    }

    private _afterReceiveRequest(): void {

        var messageInspectors = this._endpoint.messageInspectors;
        if(!messageInspectors || messageInspectors.length == 0) return;

        this._correlationStates = new Array(messageInspectors.length);
        for(var i = 0; i < messageInspectors.length; i++) {
            this._correlationStates[i] = messageInspectors[i].afterReceiveRequest(this.message);
        }
    }

    private _beforeSendReply(reply: Message): void {

        if(!this._correlationStates) return;

        var messageInspectors = this._endpoint.messageInspectors;
        for(var i = 0; i < messageInspectors.length; i++) {
            messageInspectors[i].beforeSendReply(reply, this._correlationStates[i]);
        }
    }

    private _invoke(operation: DispatchOperation, args: any[]): void {

        var instance = this._endpoint.service.instanceProvider.getInstance(this.message);

        operation.invoker.invoke(instance, args, (err, result) => {
            if (err) return this._handleError(err);

            // No need to serialize the reply if this is a one way message.
            if (operation.isOneWay) return;

            operation.formatter.serializeReply(result, (err, message) => {
                if (err) return this._handleError(err);

                this.reply(message);
            });
        });

        // If this is a one-way operation then reply immediately. We don't wait for the callback from invoke. Note
        // that this means that errors as a result of the invoke will not be reported to the client.
        if (operation.isOneWay) {
            this.reply(Message.createReply(HttpStatusCode.Ok));
        }
    }

    private _handleUncaughtException(err: Error): void {

        // Emit the error from the dispatcher.
        this._endpoint.service.dispatcher.emit('error', err);

        // The default behavior will crash the process immediately once the error is emitted. However, if the host
        // handles the event and gives us a chane to shutdown, process the error.
        if(this._errored) {
            // The uncaught exception occurred while in the error handler. Nothing else we can do but abort.
            this._endpoint.service.dispatcher.logger.trace(err, "Uncaught exception in error handler. Aborting request.");
            this.abort();
        }
        else {
            // Give error handlers a chance to process the error for logging, etc.
            this._handleError(err);
        }
    }

    private _handleError(err: Error): void {

        // Make sure the error handlers are just executed once. For example, _handleError could be called multiple
        // times if an exception occurs which is caught by the domain and passed to _handleError and then the timeout
        // for the operation invoker fires.
        if(this._errored || this._finished) return;
        this._errored = true;

        var step = -1;
        var next = (e: Error) => {
            var handler = this._endpoint.errorHandlers[++step];
            if(handler) {
                handler.handleError(e, this, CallbackUtil.onlyOnce(next));
            }
            else {
                // We've reached the end of the error handler chain. Send a reply.
                this._sendFault(e);
            }
        }
        next(err);
    }

    private _sendFault(err: Error): void {

        var fault: FaultError;
        if(FaultError.isFaultError(err)) {
            fault = <FaultError>err;
        }
        else {
            // If the error is not a FaultError, then create one. By default we return a generic message that does not
            // include any details about the error.
            if(!this._endpoint.includeErrorDetailInFault) {
                fault = new FaultError(null, "The server was unable to process the request due to an internal error.", "InternalError");
            }
            else {
                fault = new FaultError((<any>err).stack, err.message, "InternalError");
            }
        }

        this._endpoint.faultFormatter.serializeFault(fault, (err, message) => {
            // If we get an error while trying to serialize the fault then we can't reply with the error so abort request and log the error.
            if(err) {
                if(err) {
                    this._endpoint.service.dispatcher.logger.error({ err: err, endpoint: this._endpoint }, "Error serializing fault. Aborting request.");
                }
                return this.abort();
            }
            this.reply(message);
        });
    }
}

export = RequestHandler;