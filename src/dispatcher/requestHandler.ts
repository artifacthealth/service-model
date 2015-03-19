/// <reference path="../common/types.d.ts" />

import domain = require("domain");

import DispatchEndpoint = require("./dispatchEndpoint");
import DispatchOperation = require("./dispatchOperation");
import RequestContext = require("../requestContext");
import Message = require("../message");
import HttpStatusCode = require("../httpStatusCode");
import FaultError = require("../faultError");
import Callback = require("../common/callback");
import OperationContext = require("../operationContext");

class RequestHandler implements RequestContext {

    private _endpoint: DispatchEndpoint;
    private _operation: DispatchOperation;
    private _request: RequestContext;
    private _correlationStates: any[];
    private _finished: boolean;
    private _callback: Callback;
    private _errored: boolean;
    private _uncaughtException: Error;

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
     * @param callback Called when processing completes. Any uncaught exceptions are passed to callback.
     */
    process(callback?: Callback): void {

        if(this._callback) {
            throw new Error("Process called multiple times.");
        }

        if(!callback) {
            throw new Error("Missing required argument 'callback'.");
        }
        this._callback = callback;

        this._afterReceiveRequest();

        this._operation = this._endpoint.chooseOperation(this.message);
        if (!this._operation) {
            this._handleError(new Error("Unable to choose operation"));
            return;
        }

        this._operation.formatter.deserializeRequest(this.message, (err, args) => {
            if (err) return this._handleError(err);
            this._invoke(args);
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
        this._callback(this._uncaughtException);
    }

    /**
     * Abort the request without normal error handling.
     */
    abort(): void {

        if(this._finished) return;
        this._finished = true;

        this._request.abort();
        this._callback(this._uncaughtException);
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

    private _invoke(args: any[]): void {

        var instance = this._operation.endpoint.instanceProvider.getInstance(this.message);

        var d = domain.create();
        d.on('error', (err: Error) => this._handleUncaughtException(err));
        d.run(() => {
            OperationContext.current = new OperationContext();

            this._operation.invoker.invoke(instance, args, (err, result) => {
                if (err) return this._handleError(err);

                // No need to serialize the reply if this is a one way message.
                if (this._operation.isOneWay) return;

                this._operation.formatter.serializeReply(result, (err, message) => {
                    if (err) return this._handleError(err);

                    this.reply(message);
                });
            });
        });

        // If this is a one-way operation then reply immediately. We don't wait for the callback from invoke. Note
        // that this means that errors as a result of the invoke will not be reported to the client.
        if (this._operation.isOneWay) {
            this.reply();
        }
    }

    private _handleUncaughtException(err: Error): void {

        if(this._uncaughtException) {
            // Subsequent uncaught exceptions are tossed. Once we get the first uncaught exception, the system is an
            // unpredictable state anyways so subsequent exceptions are not that meaningful.
            return;
        }

        // Make note of the uncaught exception. It will be passed to the callback for the dispatcher to emit
        // after close.
        this._uncaughtException = err;

        // Tell the dispatcher to start shutting down.
        this._endpoint.service.dispatcher.close();

        if(this._errored) {
            // The uncaught exception occurred while in the error handler. Nothing else we can do but abort.
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
                handler.handleError(e, this, Callback.onlyOnce(next));
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
            // If we get an error while trying to serialize the fault then we can't reply with the error so abort request.
            if(err) {
                // TODO: use logger
                if(err) {
                    console.log(err);
                }
                return this.abort();
            }
            this.reply(message);
        });
    }
}

export = RequestHandler;