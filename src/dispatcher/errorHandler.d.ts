import { Callback } from "../common/callback";
import { RequestContext } from "../requestContext";

export interface ErrorHandler {

    /**
     * Handles an error. Note that next must be called with the error that is being handled.
     * @param err The error.
     * @param request The request context.
     * @param next Callback to call the next error handled.
     */
    handleError(err: Error, request: RequestContext, next: Callback): void;
}
