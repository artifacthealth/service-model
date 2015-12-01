import InstanceProvider = require("./instanceProvider");
import DispatchEndpoint = require("./dispatchEndpoint");
import MessageFilter = require("./messageFilter");
import ErrorHandler = require("./errorHandler");
import RequestDispatcher = require("./requestDispatcher");
import Message = require("../message");
import BaseAddressMessageFilter = require("./baseAddressMessageFilter");
import Url = require("../url");

class DispatchService {

    name: string;
    endpoints: DispatchEndpoint[] = [];

    instanceProvider: InstanceProvider;

    /**
     * Specifies whether to create an OperationContext for operations in this service. The default value is 'true'.
     */
    operationContextRequired = true;

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

    private _throwConfigError(message: string): void {

        throw new Error("Service '" + this.name + "' incorrectly configured." + message);
    }
}

export = DispatchService;