import ResultCallback = require("../common/resultCallback");
import OperationInvoker = require("./operationInvoker");
import OperationDescription = require("../description/operationDescription");
import FaultError = require("../faultError");
import Method = require("../description/method");

class DefaultOperationInvoker implements OperationInvoker {

    /**
     * Timeout for operation. Defaults to 60,000ms (1 minute).
     */
    timeout = 60000;

    private _parameterCount: number;
    private _method: Method;
    private _isAsync: boolean;

    constructor(description: OperationDescription) {

        if(!description) {
            throw new Error("Missing required argument 'operationDescription'.");
        }

        this._method = description.method;
        var parameters = description.method.parameters || [];
        this._parameterCount = parameters.length;
        if(description.isAsync) {
            // do not include callback in parameter count if async
            this._parameterCount--;
        }
        this._isAsync = description.isAsync;
    }

    invoke(instance: any, args: any[], callback: ResultCallback<any>): void {

        if(!instance) {
            throw new Error("Missing required argument 'instance'.");
        }

        if(!args) {
            throw new Error("Missing required argument 'args'.");
        }

        if(args.length != this._parameterCount) {
            process.nextTick(() => callback(new Error("Wrong number of arguments for operation.")));
            return;
        }

        // TODO: get rid of support of sync functions?
        // synchronous invoke
        if(!this._isAsync) {
            try {
                var result = this._method.invoke(instance, args);
                process.nextTick(() => callback(null, result));
            }
            catch(err) {
                // If it's a FaultError then pass the error to the callback for further processing; otherwise, rethrow
                // the  error.
                if(FaultError.isFaultError(err)) {
                    process.nextTick(() => callback(err));
                }
                else {
                    throw err;
                }
            }
            return;
        }

        // asynchronous invoke
        var timeout = false,
            finished = false;

        if(this.timeout) {
            var timeoutHandle = setTimeout(() => {
                if (finished) return;
                timeout = true;
                callback(new Error("Timeout of " + this.timeout + "ms exceeded while invoking operation."));
            }, this.timeout);
        }

        var done = (err: Error, result: any) => {

            if (timeout) return;

            if(timeoutHandle) {
                clearTimeout(timeoutHandle);
            }

            if(finished) {
                throw new Error("Callback already called.");
            }
            finished = true;
            callback(err, result);
        }

        this._method.invoke(instance, args.concat(done));
    }
}

export = DefaultOperationInvoker;