import MessageFormatter = require("./messageFormatter");
import OperationInvoker = require("./operationInvoker");
import DispatchEndpoint = require("./dispatchEndpoint");
import RequestContext = require("../requestContext");
import OperationDescription = require("../description/operationDescription");
import DefaultOperationInvoker = require("./defaultOperationInvoker");

class DispatchOperation {

    name: string;
    formatter: MessageFormatter;
    invoker: OperationInvoker;
    isOneWay: boolean;

    constructor(public endpoint: DispatchEndpoint, name: string) {

        if(!endpoint) {
            throw new Error("Missing required parameter 'endpoint'.");
        }

        if(!name) {
            throw new Error("Missing required parameter 'name'.");
        }

        this.name = name;
    }
}

export = DispatchOperation;