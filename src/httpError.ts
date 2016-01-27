import { HttpStatusCode } from "./httpStatusCode";

/**
 * An error message that sets the HTTP status code. When an operation passes a HttpError to it's callback, the
 * HttpStatusCode is used to set the status of the HTTP response. The details of the error are not passed to the client.
 */
export class HttpError implements Error {

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
        else {
            statusCode = statusCodeOrMessage;
        }

        if(!statusCode) {
            statusCode = HttpStatusCode.InternalServerError;
        }

        this.message = message;
        this.statusCode = statusCode;

        Error.call(this, message);
        (<any>Error).captureStackTrace(this, this.constructor);
    }
}

// TypeScript declares Error as an Interface instead of a class so use prototypical inheritance
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;
