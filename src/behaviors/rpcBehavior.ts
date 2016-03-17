import { EndpointDescription, EndpointBehavior } from "../description/endpointDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";
import { RpcFaultFormatter } from "../dispatcher/rpcFaultFormatter";
import { RpcMessageFormatter } from "../dispatcher/rpcMessageFormatter";
import { RpcOperationSelector } from "../dispatcher/rpcOperationSelector";
import { VersionMessageFilter } from "../dispatcher/versionMessageFilter";
import { MessageFilter } from "../dispatcher/messageFilter";
import { AddressMessageFilter } from "../dispatcher/addressMessageFilter";

/**
 * Endpoint behavior that enables RPC communication on an endpoint.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  EndpointBehavior <|.. RpcBehavior
 * </uml>
 */
export class RpcBehavior implements EndpointBehavior {

    applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void {

        endpoint.faultFormatter = new RpcFaultFormatter();
        endpoint.operationSelector = new RpcOperationSelector(endpoint);
        endpoint.filter = new AddressMessageFilter(endpoint.address).and(endpoint.filter);

        // Note that we assume the operations in the dispatcher line up with the operations in the description. This is
        // true if the dispatcher is created through the DispatcherFactory but could be incorrect otherwise. We'll at
        // least check that the names are the same.
        var operations = description.contract.operations;
        if(operations.length != endpoint.operations.length) {
            throw new Error("DispatchEndpoint and EndpointDescripition do not have the same number of operations.");
        }

        for (var i = 0; i < operations.length; i++) {
            if(endpoint.operations[i].name != operations[i].name) {
                throw new Error("Mismatch between operations in DispatchEndpoint and EndpointDescription");
            }
            endpoint.operations[i].formatter = new RpcMessageFormatter(operations[i]);
        }
    }
}
