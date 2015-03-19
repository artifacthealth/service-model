/// <reference path="./common/types.d.ts" />
import HttpStatusCode = require("./httpStatusCode");

class HttpError implements Error {

    /**
     * The name of the error.
     */
    name = "HttpError";

    /**
     * A human readable message explaining the reason for the error.
     */
    message: string;

    /**
     * The HTTP status code.
     */
    statusCode: HttpStatusCode;

    /**
     * The stack trace.
     */
    stack: string;

    constructor();
    constructor(statusCode: HttpStatusCode);
    constructor(message: string);
    constructor(statusCode: HttpStatusCode, message: string);
    constructor(statusCodeOrMessage?: any, message?: string) {

        var statusCode: HttpStatusCode;

        if(arguments.length == 1) {
            if(typeof statusCodeOrMessage === "number") {
                statusCode = statusCodeOrMessage
            }
            else {
                message = statusCodeOrMessage;
            }
        }

        if(!statusCode) {
            statusCode = HttpStatusCode.InternalServerError;
        }

        this.message = message;
        this.statusCode = statusCode;

        Error.call(this, message);
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Returns true if the error is a HttpError; otherwise, returns false.
     * @param err The error.
     */
    static isHttpError(err: Error): boolean {

        // Use duck-typing
        return err && (err instanceof Error) && err.hasOwnProperty("statusCode");
    }
}

// TypeScript declares Error as an Interface instead of a class so use prototypical inheritance
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;

export = HttpError;