import * as domain from "domain";
import {MessageHeaders} from "./messageHeaders";
import {Message} from "./message";

/**
 * Provides information about the context of the current operation.
 *
 * The OperationContext is used to find out information about the request that trigger the current operation. The
 * operation context can also be used to store information associated with a particular operation across async gaps.
 *
 * In order to store data associated with the current operation across async gaps, a domain is created during
 * operation invocation. This has the added benefit of being able to capture exceptions and route them through the error
 * handling pipeline.
 *
 * Note that if unhandled exceptions are caught, the [[RequestDispatcher]] should be closed by calling [[close]] and the
 * process should exit once all pending operations have completed. (This is indicated by the `closed`
 * event on the [[RequestDispatcher]].) See the [node documentation](https://nodejs.org/api/domain.html) for more
 * information.
 *
 * Creation of an OperationContext is disabled by default. It is be enabled for a service by setting
 * [[createOperationContext]] to true on the [[DispatchService]]. This can be accomplished by adding the [[Service]]
 * decorator to the service implementation:
 *
 * ```typescript
 * @Service({ createOperationContext: true })
 * @Contract("Calculator")
 * class CalculatorService {
 *     ...
 * }
 * ```
 *
 * Note that [domains have been deprecated](https://github.com/nodejs/node/issues/66) in Node.js and will be removed in
 * the future. According to the discussion referenced above, they will not be removed until a viable alternative is
 * introduced. However, this may introduce breaking changes in the usage of OperationContext.
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
     * Outgoing headers to be added to HTTP response. Note that the headers are not added if a fault is returned or for
     * one-way operations.
     */
    outgoingHeaders = new MessageHeaders();

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

/**
 * Represents a service request.
 */
export interface RequestContext {

    /**
     * The message for the request.
     */
    message: Message;

    /**
     * Aborts the request.
     */
    abort(): void;

    /**
     * Sends a reply to the request.
     * @param message The reply message.
     */
    reply(message?: Message): void;

    /**
     * Adds an event listener to the request. The only available event is the 'close' event which is raised if the
     * connection for the request closes unexpectedly.
     * @param event The event name.
     * @param listener A function to be called on the event.
     */
    addListener(event: string, listener: Function): RequestContext;

    /**
     * Removes an event listener from the request.
     * @param event The event name.
     * @param listener The function for the listener to remove.
     */
    removeListener(event: string, listener: Function): RequestContext;
}
