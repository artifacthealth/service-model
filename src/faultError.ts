/// <reference path="./common/types.d.ts" />

class FaultError implements Error {

    /**
     * The name of the error.
     */
    name = "FaultError";

    /**
     * A human readable message explaining the reason for the fault.
     */
    message: string;

    /**
     * A machine readable code identifying the fault.
     */
    code: string;

    /**
     * The stack trace.
     */
    stack: string;

    /**
     * Application specific information about the fault that is passed to the client.
     */
    detail: any;

    constructor(detail?: any, message?: string, code?: string) {

        if(!message) {
            message = "Unspecified service fault.";
        }

        this.message = message;
        this.detail = detail;
        this.code = code;

        Error.call(this, message);
        (<any>Error).captureStackTrace(this, this.constructor);
    }
}

// TypeScript declares Error as an Interface instead of a class so use prototypical inheritance
FaultError.prototype = Object.create(Error.prototype);
FaultError.prototype.constructor = FaultError;

export = FaultError;