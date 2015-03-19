import DispatchEndpoint = require("./dispatchEndpoint");
import RequestContext = require("../requestContext");
import MessageFilter = require("./messageFilter");
import ErrorHandler = require("./errorHandler");
import RequestDispatcher = require("./requestDispatcher");
import Message = require("../message");
import BaseAddressMessageFilter = require("./baseAddressMessageFilter");
import Url = require("../url");

class DispatchService {

    name: string;
    baseAddress: Url;
    endpoints: DispatchEndpoint[] = [];
    filter: MessageFilter;
    filterPriority: number = 0;

    /**
     * Specifies whether to create an OperationContext for operations in this service. The default value is 'true'.
     */
    createOperationContext = true;

    constructor(public dispatcher: RequestDispatcher, baseAddress: Url, name: string) {

        if(!dispatcher) {
            throw new Error("Missing required parameter 'dispatcher'.");
        }

        if(!baseAddress) {
            throw new Error("Missing required parameter 'baseAddress'.");
        }

        if(!name) {
            throw new Error("Missing required parameter 'name'.");
        }

        this.baseAddress = baseAddress;
        this.name = name;
        this.filter = new BaseAddressMessageFilter(baseAddress);
    }

    chooseEndpoint(message: Message): DispatchEndpoint {

        var max = -Infinity,
            match: DispatchEndpoint;

        for(var i = 0; i < this.endpoints.length; i++) {
            var endpoint = this.endpoints[i];
            if(endpoint.filter.match(message)) {
                if(endpoint.filterPriority > max) {
                    max = endpoint.filterPriority;
                    match = endpoint;
                }
            }
        }

        return match;
    }
}

export = DispatchService;