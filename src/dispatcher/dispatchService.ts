import { InstanceProvider } from "./instanceProvider";
import { DispatchEndpoint } from "./dispatchEndpoint";
import { MessageFilter } from "./messageFilter";
import { ErrorHandler } from "./errorHandler";
import { RequestDispatcher } from "./requestDispatcher";
import { Message } from "../message";
import { BaseAddressMessageFilter } from "./baseAddressMessageFilter";
import { Url } from "../url";

/**
 * Represents a service in the dispatcher. Exposes the configuration options for the service.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  RequestDispatcher *-- DispatchService : services
 *  DispatchService *-- DispatchEndpoint : endpoints
 *  DispatchService *-- InstanceProvider : instanceProvider
 * </uml>
 */
export class DispatchService {

    name: string;
    endpoints: DispatchEndpoint[] = [];

    instanceProvider: InstanceProvider;

    /**
     * Specifies whether to create an [[OperationContext]] for operations in this service. The default value is 'false'.
     */
    operationContextRequired = false;

    constructor(public dispatcher: RequestDispatcher, name: string) {

        if(!dispatcher) {
            throw new Error("Missing required parameter 'dispatcher'.");
        }

        if(!name) {
            throw new Error("Missing required parameter 'name'.");
        }

        this.name = name;
    }

    /**
     * Validates that the service is correctly configured.
     */
    validate(): void {

        if(!this.instanceProvider) {
            this._throwConfigError("Undefined 'instanceProvider'.");
        }

        this.endpoints.forEach(endpoint => endpoint.validate());
    }

    /**
     * Throws a configuration error.
     * @param message A message to display
     * @hidden
     */
    private _throwConfigError(message: string): void {

        throw new Error("Service '" + this.name + "' incorrectly configured." + message);
    }
}
