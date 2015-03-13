import Fault = require("../fault");
import DispatchOperation = require("./dispatchOperation");
import OperationContext = require("../operationContext");
import RequestContext = require("../requestContext");
import Message = require("../message");

/*
 OperationContext.create((operationContext) => {
 operationContext.requestContext = this._request;

 */


class RequestHandler {

    private _operation: DispatchOperation;
    private _request: RequestContext;
    private _callback: Callback;

    finished: boolean;
    next: RequestHandler;


    constructor(operation: DispatchOperation, request: RequestContext) {

        this._operation = operation;
        this._request = request;
    }

    process(callback: Callback): void {

        this._callback = callback;

        this._operation.formatter.deserializeRequest(this._request.message, (err, args) => {
            if (err) return this._handleError(err);

            var instance = this._operation.endpoint.instanceProvider.getInstance(this._request.message);

            this._operation.invoker.invoke(instance, args, (err, result) => {
                if (err) return this._handleError(err);

                // No need to serialize the reply if this is a one way message.
                if (this._operation.isOneWay) return;

                this._operation.formatter.serializeReply(result, (err, message) => {
                    if (err) return this._handleError(err);

                    this._reply(message);
                });
            });

            // If this is a one-way operation then reply immediately. We don't wait for the callback from invoke. Note
            // that this means that errors as a result of the invoke will not be reported to the client.
            if (this._operation.isOneWay) {
                this._reply();
            }
        });
    }

    private _reply(message?: Message): void {

        if(this.finished) return;

        this._request.reply(message);
        this._callback();
    }

    private _abort(err: Error): void {

        if(this.finished) return;

        this._request.abort();
        this._callback(err);
    }

    private _handleError(err: Error): void {

        var handlers = this._operation.endpoint.service.errorHandlers;

        // See if any of the error handlers know how to create a Fault
        var fault: Fault;
        for(var i = 0; i < handlers.length; i++) {
            var handler = handlers[i];
            fault = handler.provideFault && handler.provideFault(err);
            if(fault) break;
        }

        if(!fault) {
            fault = this._createFault(err);
        }

        this._operation.formatter.serializeFault(fault, (err, message) => {
            if(err) return this._abort(err);
            this._reply(message);
        });

        // Execute all the error handlers for logging, etc.
        for(var i = 0; i < handlers.length; i++) {
            var handler = handlers[i];
            handler.handleError && handler.handleError(err);
        }
    }

    private _createFault(err: Error): Fault {

        // TODO: Handle fault contracts

        if(!this._operation.endpoint.service.includeDetailsInFault) {
            return new Fault("The server was unable to process the request due to an internal error.", "InternalError");
        }

        return new Fault(err.message, "InternalError", this._getStackTrace(err));
    }

    private _getStackTrace(err: any): string {

        return err.stack;
    }
}

export = RequestHandler;