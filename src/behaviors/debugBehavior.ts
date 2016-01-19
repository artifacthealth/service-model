import { EndpointBehavior } from "../description/endpointBehavior";
import { ServiceBehavior } from "../description/serviceBehavior";
import { EndpointDescription } from "../description/endpointDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";
import { ServiceDescription } from "../description/serviceDescription";
import { DispatchService } from "../dispatcher/dispatchService";

/**
 * Service and Endpoint Behavior that enabled debugging information to be sent to the client.
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

    private _enableDebugging(endpoint: DispatchEndpoint): void {

        endpoint.includeErrorDetailInFault = true;
    }
}
