import ServiceEndpoint = require("./endpointDescription");
import DispatchEndpoint = require("../dispatcher/dispatchEndpoint");

interface EndpointBehavior {

    applyEndpointBehavior (description: ServiceEndpoint, endpoint: DispatchEndpoint): void;
}

export = EndpointBehavior;