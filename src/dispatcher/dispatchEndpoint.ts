import {DispatchOperation} from "./dispatchOperation";
import {DispatchService} from "./dispatchService";
import {MessageFilter} from "./messageFilter";
import {EndpointDescription} from "../description/endpointDescription";
import {DefaultInstanceProvider} from "./defaultInstanceProvider";
import {Message} from "../message";
import {Url} from "../url";
import {RequestContext} from "../operationContext";
import {FaultError} from "../faultError";
import {ResultCallback, Callback} from "../common/callbackUtil";

/**
 * Represents an endpoint for a service in the dispatcher. Exposes configuration options for the endpoint.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  DispatchService *-- DispatchEndpoint : endpoints
 *  DispatchEndpoint *-- DispatchOperation : operations
 *  DispatchEndpoint *- MessageFilter : filter
 *  OperationSelector -* DispatchEndpoint : operationSelector
 *  DispatchEndpoint *-- MessageInspector : messageInspectors
 *  DispatchEndpoint *-- ErrorHandler : errorHandlers
 *  DispatchEndpoint *-- FaultFormatter : faultFormatter
 * </uml>
 */
export class DispatchEndpoint {

    /**
     * The base address for the endpoint.
     */
    address: Url;

    /**
     * Filter used to identify a [[Message]] as available to be processed by the endpoint.
     */
    filter: MessageFilter;

    /**
     * Indicates the priority of the endpoint if more than one endpoint can process the message. A higher value
     * indicates a higher priority. If all endpoints have the same priority then the first matching endpoint is used.
     */
    filterPriority: number = 0;

    /**
     * The name of the service contract handled by the endpoint.
     */
    contractName: string;

    /**
     * A list of operations available for the endpoint.
     */
    operations: DispatchOperation[] = [];

    /**
     * An object that chooses which [[DispatchOperation]] will be invoked for the [[Message]].
     */
    operationSelector: OperationSelector;

    /**
     * A [[DispatchOperation]] which is invoked for the [[OperationSelector]] is unable to choose the appropriate [[DispatchOperation]].
     */
    unhandledOperation: DispatchOperation;

    /**
     * A list of message inspectors for this endpoint.
     */
    messageInspectors: MessageInspector[] = [];

    /**
     * A list of error handlers for this endpoint.
     */
    errorHandlers: ErrorHandler[] = [];

    /**
     * The object responsible for formatting errors.
     */
    faultFormatter: FaultFormatter;

    /**
     * Specifies whether to include the error message and stack trace in faults created from errors. This should not
     * be turned on in production.
     */
    includeErrorDetailInFault: boolean;

    constructor(public service: DispatchService, address: Url, contractName: string) {

        if(!service) {
            throw new Error("Missing required parameter 'service'.");
        }

        if(!address) {
            throw new Error("Missing required parameter 'address'.");
        }

        if(!contractName) {
            throw new Error("Missing required parameter 'contractName'.");
        }

        this.address = address;
        this.contractName = contractName;
    }

    /**
     * Validates that the endpoint is correctly configured.
     */
    validate(): void {

        if(!this.filter) {
            this._throwConfigError("Undefined 'filter'.");
        }

        if(!this.operationSelector) {
            this._throwConfigError("Undefined 'operationSelector'.");
        }

        if(!this.faultFormatter) {
            this._throwConfigError("Undefined 'faultFormatter'.");
        }
    }

    /**
     * Throws a configuration error.
     * @param message A message to display
     * @hidden
     */
    private _throwConfigError(message: string): void {

        throw new Error("Endpoint at address '" + this.address + "' incorrectly configured: " + message);
    }

    /**
     * Returns the [[DispatchOperation]] that will be invoked for the [[Message]].
     * @param message The message.
     */
    chooseOperation(message: Message): DispatchOperation {

        var operation = this.operationSelector.selectOperation(message);
        if(!operation) {
            operation = this.unhandledOperation;
        }
        return operation;
    }
}

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

/**
 * Describes a type that is able to choose the appropriate operation for a given message.
 */
export interface OperationSelector {

    /**
     * Chooses the appropriate operation for the given message.
     * @param message The request message.
     */
    selectOperation(message: Message): DispatchOperation;
}

/**
 * Describes a type that can serialize response messages for a service endpoint.
 */
export interface FaultFormatter {

    serializeFault(fault: FaultError, callback: ResultCallback<Message>): void;
}

/**
 * Describes an extension point that can inspect and modify messages.
 */
export interface MessageInspector {

    /**
     * Called after a message has been received but before it has been dispatched. Returns a value that is passed
     * to beforeSendReply.
     * @param request The request message.
     */
    afterReceiveRequest(request: Message): any;

    /**
     * Called after the operation has returned but before the reply message is sent.
     * @param reply The reply message.
     * @param state The value returned from afterReceiveRequest.
     */
    beforeSendReply(reply: Message, state: any): void;
}

