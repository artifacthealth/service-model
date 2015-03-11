/// <reference path="../common/types.d.ts" />

import reflect = require("tsreflect");
import OperationInvoker = require("./operationInvoker");
import OperationDescription = require("../description/operationDescription");

class DefaultOperationInvoker implements OperationInvoker {

    timeout: number;

    private _parameterCount: number;
    private _method: reflect.Symbol;
    private _isAsync: boolean;

    constructor(od: OperationDescription) {

        if(!od) {
            throw new Error("Missing required argument 'operationDescription'.");
        }

        this._method = od.method;
        this._parameterCount = od.method.getType().getCallSignatures()[0].getParameters().length;
        this._isAsync = od.isAsync;
    }

    invoke(instance: any, args: any[], callback: ResultCallback<any>): void {

        if(!instance) {
            process.nextTick(() => callback(new Error("Missing required argument 'instance'.")));
            return;
        }

        if(!args) {
            process.nextTick(() => callback(new Error("Missing required argument 'args'.")));
            return;
        }

        if(args.length != this._parameterCount) {
            process.nextTick(() => callback(new Error("Wrong number of arguments for operation in 'args'.")));
            return;
        }

        var operation = this._method.getValue(instance);
        if(!operation) {
            process.nextTick(() => callback(new Error("Instance is missing operation.")));
            return;
        }

        // synchronous invoke
        if(!this._isAsync) {
            try {
                process.nextTick(() => callback(null, operation.apply(instance, args)));
            }
            catch(err) {
                process.nextTick(() => callback(err));
            }
            return;
        }

        // asynchronous invoke
        var timeout = false,
            finished = false;

        var timeoutHandle = setTimeout(() => {
            timeout = true;
            callback(new Error("Timeout of " + this.timeout + "ms exceeded."));
        }, this.timeout || 60000);

        var done = (err: Error, result: any) => {

            if (timeout) return;
            clearTimeout(timeoutHandle);

            if(finished) {
                callback(new Error("done() called multiple times."));
                return;
            }
            finished = true;

            callback(err, result);
        }

        // catch any exceptions because we don't want any errors to cause timeout
        try {
            operation.apply(instance, args.concat(done));
        }
        catch(err) {
            clearTimeout(timeoutHandle);
            process.nextTick(() => callback(err));
        }
    }
}

export = DefaultOperationInvoker;