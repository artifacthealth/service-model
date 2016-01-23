import { HttpError } from "./httpError";
import { HttpStatusCode } from "./httpStatusCode";

/**
 * An error that is returned to the client. When an operation passes a FaultError to it's callback, the specifics of the
 * error are passed to the client including the code, details, and message. Additionally, the HttpStatusCode is used
 * to set the status on the HTTP response.
 */
export class FaultError extends HttpError {

    /**
     * The name of the error.
     */
    name = "FaultError";

    /**
     * Application specific machine readable code identifying the fault.
     */
    code: string;

    /**
     * Application specific information about the fault that is passed to the client.
     */
    detail: any;

    constructor(detail?: any, message?: string, code?: string, statusCode?: HttpStatusCode) {
        super(statusCode, message);

        this.code = code;
        this.detail = detail;
    }

    /**
     * Returns true if the error is a FaultError; otherwise, returns false.
     * @param err The error.
     */
    static isFaultError(err: Error): boolean {

        // Use duck-typing
        return HttpError.isHttpError(err) && err.hasOwnProperty("code") && err.hasOwnProperty("detail");
    }
}
