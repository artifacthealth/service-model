import EndpointDescription = require("./endpointDescription");
import DispatchEndpoint = require("../dispatcher/dispatchEndpoint");

interface EndpointBehavior {

    applyEndpointBehavior (description: EndpointDescription, endpoint: DispatchEndpoint): void;
}

export = EndpointBehavior;