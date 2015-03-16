/// <reference path="../common/types.d.ts" />

import FaultError = require("../faultError");
import DispatchEndpoint = require("./dispatchEndpoint");
import DispatchOperation = require("./dispatchOperation");
import RequestContext = require("../requestContext");
import Message = require("../message");
import HttpStatusCode = require("../httpStatusCode");
import Callback = require("../common/callback");

/*
 OperationContext.create((operationContext) => {
 operationContext.requestContext = this._request;

 */


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
            this._handleError(new Error("Unable to determine operation."));
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

        // TODO: try using domains for operation context.

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

        var next = (err: Error) => {
            var handler = this._endpoint.errorHandlers[++step];
            if(handler) {
                handler.handleError(err, this, Callback.onlyOnce(next));
            }
            else {
                if(!this._operation) {
                    this.reply(Message.create(HttpStatusCode.NotFound));
                }
                this._operation.formatter.serializeFault(this._createFault(err), (err, message) => {
                    if(err) return this.abort(err);
                    this.reply(message);
                });
            }
        }

        next(err);
    }

    private _createFault(err: Error): FaultError {

        if(err.name == "FaultError") {
            return <FaultError>err;
        }

        if(!this._endpoint.includeErrorDetailsInFault) {
            return new FaultError(null, "The server was unable to process the request due to an internal error.", "InternalError");
        }

        return new FaultError(this._getStackTrace(err), err.message, "InternalError");
    }

    private _getStackTrace(err: any): string {

        return err.stack;
    }
}

export = RequestHandler;