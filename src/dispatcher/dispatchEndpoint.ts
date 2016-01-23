import { OperationSelector } from "./operationSelector";
import { DispatchOperation } from "./dispatchOperation";
import { DispatchService } from "./dispatchService";
import { MessageFilter } from "./messageFilter";
import { EndpointDescription } from "../description/endpointDescription";
import { DefaultInstanceProvider } from "./defaultInstanceProvider";
import { MessageInspector } from "./messageInspector";
import { Message } from "../message";
import { Url } from "../url";
import { ErrorHandler } from "./errorHandler";
import { FaultFormatter } from "./faultFormatter";

/**
 * Represents an endpoint for a service in the dispatcher. Exposes configuration options for the endpoint.
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
     * Indicates the priority of the endpoint if more than one endpoint can process the message.
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
