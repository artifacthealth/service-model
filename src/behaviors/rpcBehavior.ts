import EndpointBehavior = require("../description/endpointBehavior");
import EndpointDescription = require("../description/endpointDescription");
import DispatchEndpoint = require("../dispatcher/dispatchEndpoint");
import RpcFaultFormatter = require("../dispatcher/rpcFaultFormatter");
import RpcMessageFormatter = require("../dispatcher/rpcMessageFormatter");
import RpcOperationSelector = require("../dispatcher/rpcOperationSelector");
import VersionMessageFilter = require("../dispatcher/versionMessageFilter");
import MessageFilter = require("../dispatcher/messageFilter");
import AddressMessageFilter = require("../dispatcher/addressMessageFilter");

class RpcBehavior implements EndpointBehavior {

    applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void {

        endpoint.faultFormatter = new RpcFaultFormatter();
        endpoint.operationSelector = new RpcOperationSelector(endpoint);
        endpoint.filter = new AddressMessageFilter(endpoint.address).and(endpoint.filter);

        // Note that we assume the operations in the dispatcher line up with the operations in the description. This is
        // true if the dispatcher is created through the DispatcherFactory but could be incorrect otherwise. We'll at
        // least check that the names are the same.
        var operations = description.contract.operations;
        for (var i = 0; i < operations.length; i++) {
            if(endpoint.operations[i].name != operations[i].name) {
                throw new Error("Mismatch between operations in DispatchEndpoint and EndpointDescription");
            }
            endpoint.operations[i].formatter = new RpcMessageFormatter(operations[i]);
        }
    }
}

export = RpcBehavior;