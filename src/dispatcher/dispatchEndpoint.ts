import InstanceProvider = require("./instanceProvider");
import OperationSelector = require("./operationSelector");
import DispatchOperation = require("./dispatchOperation");
import DispatchService = require("./dispatchService");
import RequestContext = require("../requestContext");
import MessageFilter = require("./messageFilter");
import EndpointDescription = require("../description/endpointDescription");
import AddressMessageFilter = require("./addressMessageFilter");
import DefaultInstanceProvider = require("./defaultInstanceProvider")

class DispatchEndpoint {

    name: string;
    address: string;
    filter: MessageFilter;
    filterPriority: number = 0;
    instanceProvider: InstanceProvider;
    operations: DispatchOperation[] = [];
    operationSelector: OperationSelector;
    unhandledOperation: DispatchOperation;

    constructor(public service: DispatchService, address: string, name: string) {

        if(!service) {
            throw new Error("Missing required parameter 'service'.");
        }

        if(!address) {
            throw new Error("Missing required parameter 'address'.");
        }

        if(!name) {
            throw new Error("Missing required parameter 'name'.");
        }

        this.address = address;
        this.name = name;
        this.filter = new AddressMessageFilter(address);
    }
}

export = DispatchEndpoint;