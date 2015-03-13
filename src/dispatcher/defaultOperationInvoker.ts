/// <reference path="../common/types.d.ts" />

import reflect = require("tsreflect");
import OperationInvoker = require("./operationInvoker");
import OperationDescription = require("../description/operationDescription");

class DefaultOperationInvoker implements OperationInvoker {

    timeout: number;

    private _parameterCount: number;
    private _method: reflect.Symbol;
    private _isAsync: boolean;

    constructor(description: OperationDescription) {

        if(!description) {
            throw new Error("Missing required argument 'operationDescription'.");
        }

        this._method = description.method;
        this._parameterCount = description.method.getType().getCallSignatures()[0].getParameters().length;
        if(description.isAsync) {
            // do not include callback in parameter count if async
            this._parameterCount--;
        }
        this._isAsync = description.isAsync;
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

        // synchronous invoke
        if(!this._isAsync) {
            try {
                process.nextTick(() => callback(null, this._method.invoke(instance, args)));
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
            this._method.invoke(instance, args.concat(done));
        }
        catch(err) {
            clearTimeout(timeoutHandle);
            process.nextTick(() => callback(err));
        }
    }
}

export = DefaultOperationInvoker;