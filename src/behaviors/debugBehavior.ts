import EndpointBehavior = require("../description/endpointBehavior");
import ServiceBehavior = require("../description/serviceBehavior");
import EndpointDescription = require("../description/endpointDescription");
import DispatchEndpoint = require("../dispatcher/dispatchEndpoint");
import ServiceDescription = require("../description/serviceDescription");
import DispatchService = require("../dispatcher/dispatchService");

/**
 * Service and Endpoint Behavior that enabled debugging information to be sent to the client.
 */
class DebugBehavior implements EndpointBehavior, ServiceBehavior {

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

export = DebugBehavior;