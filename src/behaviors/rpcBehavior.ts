import { EndpointDescription, EndpointBehavior } from "../description/endpointDescription";
import {DispatchEndpoint, FaultFormatter, OperationSelector} from "../dispatcher/dispatchEndpoint";
import { RpcFaultFormatter } from "../dispatcher/rpcFaultFormatter";
import { RpcMessageFormatter } from "../dispatcher/rpcMessageFormatter";
import { RpcOperationSelector } from "../dispatcher/rpcOperationSelector";
import { VersionMessageFilter } from "../dispatcher/versionMessageFilter";
import { MessageFilter } from "../dispatcher/messageFilter";
import { AddressMessageFilter } from "../dispatcher/addressMessageFilter";
import {MessageFormatter} from "../dispatcher/dispatchOperation";
import {OperationDescription} from "../description/operationDescription";

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

        endpoint.faultFormatter = this.createFaultFormatter();
        endpoint.operationSelector = this.createOperationSelector(description, endpoint);
        endpoint.filter = this.createMessageFilter(endpoint);

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
            endpoint.operations[i].formatter = this.createMessageFormatter(endpoint, operations[i]);
        }
    }

    protected createFaultFormatter(): FaultFormatter {

        return new RpcFaultFormatter()
    }

    protected createMessageFilter(endpoint: DispatchEndpoint): MessageFilter {

        return new AddressMessageFilter(endpoint.address).and(endpoint.filter);
    }

    protected createOperationSelector(description: EndpointDescription, endpoint: DispatchEndpoint): OperationSelector {

        return new RpcOperationSelector(endpoint);
    }

    protected createMessageFormatter(endpoint: DispatchEndpoint, operation: OperationDescription): MessageFormatter {

        return new RpcMessageFormatter(operation);
    }
}
