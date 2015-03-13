import InstanceProvider = require("./instanceProvider");
import OperationSelector = require("./operationSelector");
import DispatchOperation = require("./dispatchOperation");
import DispatchService = require("./dispatchService");
import RequestContext = require("../requestContext");
import MessageFilter = require("./messageFilter");
import EndpointDescription = require("../description/endpointDescription");
import AddressMessageFilter = require("./addressMessageFilter");
import DefaultInstanceProvider = require("./defaultInstanceProvider")
import Message = require("../message");
import Url = require("../url");

class DispatchEndpoint {

    name: string;
    address: Url;
    filter: MessageFilter;
    filterPriority: number = 0;
    instanceProvider: InstanceProvider;
    operations: DispatchOperation[] = [];
    operationSelector: OperationSelector;
    unhandledOperation: DispatchOperation;

    constructor(public service: DispatchService, address: Url, name: string) {

        if(!service) {
            throw new Error("Missing required parameter 'service'.");
        }

        if(!address) {
            throw new Error("Missing required parameter 'address'.");
        }

        this.address = address;
        this.name = name;
        this.filter = new AddressMessageFilter(address);
    }

    chooseOperation(message: Message): DispatchOperation {

        var operation = this.operationSelector.selectOperation(message);
        if(!operation) {
            operation = this.unhandledOperation;
        }
        return operation;
    }
}

export = DispatchEndpoint;