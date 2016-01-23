import { Callback } from "../common/callback";
import { RequestContext } from "../requestContext";

/**
 * Describes a type that can handle errors for a service endpoint.
 */
export interface ErrorHandler {

    /**
     * Handles an error.
     * @param err The error.
     * @param request The request context.
     * @param next Callback to call the next error handler. If the error handler sends a reply then `next` does not need
     * to be called. If `next` is called, it must be called with an Error object. However, it does not eed to call
     * `next` with the same Error it was passed. For example, it may choose to transform a generic Error into a
     * FaultError.
     */
    handleError(err: Error, request: RequestContext, next: Callback): void;
}
