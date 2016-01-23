import * as domain from "domain";
import { RequestContext } from "./requestContext";

/**
 * The operation context is used to find out information about request that trigger the current operation. The operation
 * context can also be used to store information associated with a particular operation across async gaps.
 *
 * In order to store data associated with the current operation across async gaps, a domain is created during
 * operation invocation. This has the added benefit of being able to capture exceptions and route them through the error
 * handling pipeline. Note that if unhandled errors are caught, the [[RequestDispatcher]] should be closed and the process
 * should exit once all pending operations have returned (or timed out).
 *
 * Creation of the operation context can be disabled for a service by setting [[operationContextRequired]] to false on
 * the [[DispatchService]]. See the [node documentation](https://nodejs.org/api/domain.html) for more information.
 */
export class OperationContext {

    /**
     * Gets the RequestContext associated with the operation.
     */
    requestContext: RequestContext;

    /**
     * Dictionary of values associated with the OperationContext. Can be used to share data between functions within
     * the context of the execution of an operation.
     */
    items = new Map<string, any>();

    /**
     * Gets the OperationContext associated with the active domain. Throws an error if there is not an active domain.
     */
    static get current(): OperationContext {

        return OperationContext._activeDomain().__operation_context__;
    }

    /**
     * Sets the OperationContext associated with the active domain. Throws an error if there is not an active domain.
     * @param context The current context.
     */
    static set current(context: OperationContext) {

        OperationContext._activeDomain().__operation_context__ = context;
    }

    /**
     * Returns the active domain.
     * @hidden
     */
    private static _activeDomain(): any {

        var active = (<any>domain).active;
        if(!active) {
            throw new Error("There is not an active domain.");
        }
        return active;
    }
}
