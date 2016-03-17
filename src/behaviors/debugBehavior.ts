import { EndpointDescription, EndpointBehavior } from "../description/endpointDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";
import { ServiceDescription, ServiceBehavior } from "../description/serviceDescription";
import { DispatchService } from "../dispatcher/dispatchService";

/**
 * Service and Endpoint Behavior that enabled debugging information to be sent to the client.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  EndpointBehavior <|.. DebugBehavior
 *  ServiceBehavior <|.. DebugBehavior
 * </uml>
 */
export class DebugBehavior implements EndpointBehavior, ServiceBehavior {

    applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void {

        this._enableDebugging(endpoint);
    }

    applyServiceBehavior(description: ServiceDescription, service: DispatchService): void {

        for(var i = 0; i < service.endpoints.length; i++) {
            this._enableDebugging(service.endpoints[i]);
        }
    }

    /**
     * Enables debugging information in error messages for an endpoint.
     * @param endpoint The target endpoint.
     * @hidden
     */
    private _enableDebugging(endpoint: DispatchEndpoint): void {

        endpoint.includeErrorDetailInFault = true;
    }
}
