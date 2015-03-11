/// <reference path="../common/types.d.ts" />

import async = require("async");

import DispatchService = require("./dispatchService");
import DispatchEndpoint = require("./dispatchEndpoint");
import DispatchOperation = require("./dispatchOperation");
import RequestContext = require("../requestContext");
import OperationContext = require("../operationContext");
import Message = require("../message");
import Fault = require("../fault");

class RequestDispatcher {

    services: DispatchService[];

    /**
     * Maximum number of concurrent operations. If the number is exceeded, any additional operations are queued.
     */
    maxConcurrentCalls = 16;

    _queue: AsyncQueue<OperationHandler>;

    constructor() {
        this._queue = async.queue((task: OperationHandler, done: Callback) => {
            task.process(done);
        }, this.maxConcurrentCalls);
    }

    dispatch(request: RequestContext): boolean {

        // TODO: once we've gone through the trouble of creating the request object, shouldn't we throw an error
        // if we can't find the service?

        var service = this.chooseService(request.message);
        if(!service) {
            return false
        }

        var endpoint = service.chooseEndpoint(request.message);
        if(!endpoint) {
            return false;
        }

        var operation = endpoint.operationSelector.selectOperation(request.message);
        if(!operation) {
            operation = endpoint.unhandledOperation;
        }

        if(!operation) {
            return false;
        }

        this._queue.push(new OperationHandler(operation, request));
        return true;
    }

    chooseService(message: Message): DispatchService {

        var max = -Infinity,
            match: DispatchService;

        for(var i = 0; i < this.services.length; i++) {
            var service = this.services[i];
            if(service.filter.match(message)) {
                if(service.filterPriority > max) {
                    max = service.filterPriority;
                    match = service;
                }
            }
        }

        return match;
    }
}

class OperationHandler {

    private _operation: DispatchOperation;
    private _request: RequestContext;
    private _callback: Callback;
    private _replied: boolean;

    constructor(operation: DispatchOperation, request: RequestContext) {

        this._operation = operation;
        this._request = request;
    }

    process(callback: Callback): void {

        this._callback = callback;

        OperationContext.create((operationContext) => {

            operationContext.requestContext = this._request;

            this._operation.formatter.deserializeRequest(this._request.message, (err, args) => {
                if(err) return this._handleError(err);

                var instance = this._operation.endpoint.instanceProvider.getInstance(this._request.message);

                this._operation.invoker.invoke(instance, args, (err, result) => {
                    if(err) return this._handleError(err);

                    // No need to serialize the reply if this is a one way message.
                    if(this._operation.isOneWay) return;

                    this._operation.formatter.serializeReply(result, (err, message) => {
                        if(err) return this._handleError(err);

                        this._reply(message);
                    });
                });

                // If this is a one-way operation then reply immediately. We don't wait for the callback from invoke. Note
                // that this means that errors as a result of the invoke will not be reported to the client.
                if(this._operation.isOneWay) {
                    this._reply();
                }
            });

        });
    }

    private _reply(message?: Message): void {

        if(this._replied) return;

        this._request.reply(message);
        this._replied = true
        this._callback();
    }

    private _handleError(err: Error): void {

        var handlers = this._operation.endpoint.service.errorHandlers;
        if(!handlers || handlers.length == 0) {
            return this._callback(err);
        }

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
            if(err) this._callback(err);

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

export = RequestDispatcher;
