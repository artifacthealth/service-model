import { ResultCallback } from "../common/resultCallback";
import { OperationInvoker } from "./operationInvoker";
import { OperationDescription } from "../description/operationDescription";
import { FaultError } from "../faultError";
import { Method } from "reflect-helper";

/**
 * @hidden
 */
export class DefaultOperationInvoker implements OperationInvoker {

    /**
     * Timeout for operation. Defaults to 60,000ms (1 minute).
     */
    timeout = 60000;

    private _parameterCount: number;
    private _method: Method;

    constructor(description: OperationDescription) {

        if(!description) {
            throw new Error("Missing required argument 'operationDescription'.");
        }

        this._method = description.method;
        var parameters = description.method.parameters || [];
        // do not include callback in parameter count
        this._parameterCount = parameters.length - 1;
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
