import MessageFormatter = require("./messageFormatter");
import OperationInvoker = require("./operationInvoker");
import DispatchEndpoint = require("./dispatchEndpoint");
import OperationDescription = require("../description/operationDescription");
import DefaultOperationInvoker = require("./defaultOperationInvoker");

class DispatchOperation {

    name: string;
    formatter: MessageFormatter;
    invoker: OperationInvoker;
    isOneWay: boolean;
    timeout: number;

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

    private _throwConfigError(message: string): void {

        throw new Error("Operation '" + this.name + "' on service '" + this.endpoint.service + "' incorrectly configured. " + message);
    }
}

export = DispatchOperation;