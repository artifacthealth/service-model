import { MessageFormatter } from "./messageFormatter";
import { OperationInvoker } from "./operationInvoker";
import { DispatchEndpoint } from "./dispatchEndpoint";
import { OperationDescription } from "../description/operationDescription";
import { DefaultOperationInvoker } from "./defaultOperationInvoker";

/**
 * Represents an operation on a service endpoint in the dispatcher. Exposes configuration options for the operation.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  DispatchEndpoint *-- DispatchOperation : operations
 *  DispatchOperation *-- OperationInvoker : invoker
 *  DispatchOperation *-- MessageFormatter : formatter
 * </uml>
 */
export class DispatchOperation {

    /**
     * The name of the operation.
     */
    name: string;

    /**
     * The formatter for the operation, responsible for serializing and deserailizing requests.
     */
    formatter: MessageFormatter;

    /**
     * The object responsible for invoking the service method.
     */
    invoker: OperationInvoker;

    /**
     * Indicates if the operation is one way. If true the dispatcher does not wait for the operation to complete before
     * sending a response to the client.
     */
    isOneWay: boolean;

    /**
     * Timeout for the operation in milliseconds. If not specified defaults to a minute. A value of 0 indicates that
     * operation does not timeout.
     */
    timeout: number;

    /**
     * Constructs a dispatch operation.
     * @param endpoint The endpoint.
     * @param name The name of the operation.
     */
    constructor(public endpoint: DispatchEndpoint, name: string) {

        if(!endpoint) {
            throw new Error("Missing required parameter 'endpoint'.");
        }

        if(!name) {
            throw new Error("Missing required parameter 'name'.");
        }

        this.name = name;
    }

    /**
     * Validates that the operation is correctly configured.
     */
    validate(): void {

        if(!this.formatter) {
            this._throwConfigError("Undefined 'formatter'.");
        }

        if(!this.invoker) {
            this._throwConfigError("Undefined 'invoker'.");
        }
    }

    /**
     * Throws a configuration error.
     * @param message A message to display
     * @hidden
     */
    private _throwConfigError(message: string): void {

        throw new Error("Operation '" + this.name + "' on service '" + this.endpoint.service.name + "' incorrectly configured. " + message);
    }
}
