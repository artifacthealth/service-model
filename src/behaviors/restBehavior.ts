import {EndpointBehavior} from "../description/endpointBehavior";
import {EndpointDescription} from "../description/endpointDescription";
import {DispatchEndpoint} from "../dispatcher/dispatchEndpoint";
import {RestMessageFormatter} from "../dispatcher/restMessageFormatter";
import {RestFaultFormatter} from "../dispatcher/restFaultFormatter";
import {RestOperationSelector} from "../dispatcher/restOperationSelector";
import {BaseAddressMessageFilter} from "../dispatcher/baseAddressMessageFilter";

export class RestBehavior implements EndpointBehavior {

    applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void {

        endpoint.faultFormatter = new RestFaultFormatter();
        endpoint.filter = new BaseAddressMessageFilter(endpoint.address).and(endpoint.filter);
        endpoint.operationSelector = new RestOperationSelector(description, endpoint);

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

            endpoint.operations[i].formatter = new RestMessageFormatter(endpoint, operations[i]);
        }
    }
}
