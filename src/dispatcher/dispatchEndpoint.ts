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

export class DispatchEndpoint {

    /**
     * The endpoint address.
     */
    address: Url;

    filter: MessageFilter;
    filterPriority: number = 0;

    contractName: string;

    operations: DispatchOperation[] = [];
    operationSelector: OperationSelector;
    unhandledOperation: DispatchOperation;

    messageInspectors: MessageInspector[] = [];

    errorHandlers: ErrorHandler[] = [];
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

    private _throwConfigError(message: string): void {

        throw new Error("Endpoint at address '" + this.address + "' incorrectly configured: " + message);
    }

    chooseOperation(message: Message): DispatchOperation {

        var operation = this.operationSelector.selectOperation(message);
        if(!operation) {
            operation = this.unhandledOperation;
        }
        return operation;
    }
}
