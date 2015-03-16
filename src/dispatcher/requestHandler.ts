/// <reference path="../common/types.d.ts" />

import DispatchEndpoint = require("./dispatchEndpoint");
import DispatchOperation = require("./dispatchOperation");
import RequestContext = require("../requestContext");
import Message = require("../message");
import HttpStatusCode = require("../httpStatusCode");
import FaultError = require("../faultError");
import Callback = require("../common/callback");

class RequestHandler implements RequestContext {

    private _endpoint: DispatchEndpoint;
    private _operation: DispatchOperation;
    private _request: RequestContext;
    private _callback: Callback;
    private _correlationStates: any[];

    message: Message;

    finished: boolean;
    next: RequestHandler;


    constructor(endpoint: DispatchEndpoint, request: RequestContext) {
        this.message = request.message;
        this._endpoint = endpoint;
        this._request = request;
    }

    process(callback: Callback): void {

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

    private _afterReceiveRequest(): void {

        var messageInspectors = this._endpoint.messageInspectors;
        if(!messageInspectors || messageInspectors.length == 0) return;

        this._correlationStates = new Array(messageInspectors.length);
        for(var i = 0; i < messageInspectors.length; i++) {
            this._correlationStates[i] = messageInspectors[i].afterReceiveRequest(this.message);
        }
    }

    private _beforeSendReply(): void {

        if(!this._correlationStates) return;

        var messageInspectors = this._endpoint.messageInspectors;
        for(var i = 0; i < messageInspectors.length; i++) {
            messageInspectors[i].beforeSendReply(this.message, this._correlationStates[i]);
        }
    }

    private _invoke(args: any[]): void {

        var instance = this._operation.endpoint.instanceProvider.getInstance(this.message);

        this._operation.invoker.invoke(instance, args, (err, result) => {
            if (err) return this._handleError(err);

            // No need to serialize the reply if this is a one way message.
            if (this._operation.isOneWay) return;

            this._operation.formatter.serializeReply(result, (err, message) => {
                if (err) return this._handleError(err);

                this.reply(message);
            });
        });

        // If this is a one-way operation then reply immediately. We don't wait for the callback from invoke. Note
        // that this means that errors as a result of the invoke will not be reported to the client.
        if (this._operation.isOneWay) {
            this.reply();
        }
    }

    reply(message?: Message): void {

        if(this.finished) return;

        this._beforeSendReply();

        this._request.reply(message);
        this._callback();
    }

    // TODO: should we get rid of abort?
    abort(err?: Error): void {

        if(this.finished) return;

        this._request.abort();
        this._callback(err);
    }

    private _handleError(err: Error): void {

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
            if(err) return this.abort(err);
            this.reply(message);
        });
    }
}

export = RequestHandler;