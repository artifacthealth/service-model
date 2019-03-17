import {EndpointDescription, EndpointBehavior} from "../description/endpointDescription";
import {DispatchEndpoint, FaultFormatter, OperationSelector} from "../dispatcher/dispatchEndpoint";
import {RestMessageFormatter} from "../dispatcher/restMessageFormatter";
import {RestFaultFormatter} from "../dispatcher/restFaultFormatter";
import {RestOperationSelector} from "../dispatcher/restOperationSelector";
import {BaseAddressMessageFilter} from "../dispatcher/baseAddressMessageFilter";
import {WebInvokeAnnotation} from "../annotations";
import {OperationDescription} from "../description/operationDescription";
import {MessageFormatter} from "../dispatcher/dispatchOperation";
import {MessageFilter} from "../dispatcher/messageFilter";

/**
 * Endpoint behavior that enables REST communication on an endpoint.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  EndpointBehavior <|.. RestBehavior
 * </uml>
 */
export class RestBehavior implements EndpointBehavior {

    applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void {

        endpoint.faultFormatter = this.createFaultFormatter();
        endpoint.filter = this.createMessageFilter(endpoint);
        endpoint.operationSelector = this.createOperationSelector(description, endpoint);

        // Note that we assume the operations in the dispatcher line up with the operations in the description. This is
        // true if the dispatcher is created through the DispatcherFactory but could be incorrect otherwise. We'll at
        // least check that the names are the same.
        var operations = description.contract.operations;
        if(operations.length != endpoint.operations.length) {
            throw new Error("DispatchEndpoint and EndpointDescription do not have the same number of operations.");
        }

        for (var i = 0; i < operations.length; i++) {

            // check if method is annotated as callback through the REST api
            var annotation = operations[i].method.getAnnotations(WebInvokeAnnotation)[0];
            if(annotation) {
                if (endpoint.operations[i].name != operations[i].name) {
                    throw new Error("Mismatch between operations in DispatchEndpoint and EndpointDescription");
                }

                endpoint.operations[i].formatter = this.createMessageFormatter(endpoint, operations[i]);
            }
        }
    }

    protected createFaultFormatter(): FaultFormatter {

        return new RestFaultFormatter()
    }

    protected createMessageFilter(endpoint: DispatchEndpoint): MessageFilter {

        return new BaseAddressMessageFilter(endpoint.address).and(endpoint.filter);
    }

    protected createOperationSelector(description: EndpointDescription, endpoint: DispatchEndpoint): OperationSelector {

        return new RestOperationSelector(description, endpoint);
    }

    protected createMessageFormatter(endpoint: DispatchEndpoint, operation: OperationDescription): MessageFormatter {

        return new RestMessageFormatter(endpoint, operation);
    }
}
