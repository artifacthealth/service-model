import InstanceProvider = require("./instanceProvider");
import OperationSelector = require("./operationSelector");
import DispatchOperation = require("./dispatchOperation");
import DispatchService = require("./dispatchService");
import RequestContext = require("../requestContext");
import MessageFilter = require("./messageFilter");
import EndpointDescription = require("../description/endpointDescription");
import AddressMessageFilter = require("./addressMessageFilter");
import DefaultInstanceProvider = require("./defaultInstanceProvider")
import MessageInspector = require("./messageInspector");
import Message = require("../message");
import Url = require("../url");
import ErrorHandler = require("./errorHandler");
import FaultFormatter = require("./faultFormatter");

class DispatchEndpoint {

    name: string;
    address: Url;
    filter: MessageFilter;
    filterPriority: number = 0;
    contractName: string;
    instanceProvider: InstanceProvider;
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
        // TODO: take contract version into account if present in the request. Need to decide how to specify version requested.
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