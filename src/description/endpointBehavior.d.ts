import ServiceEndpoint = require("./endpointDescription");
import DispatchEndpoint = require("../dispatcher/dispatchEndpoint");

interface EndpointBehavior {

    applyBehavior (description: ServiceEndpoint, endpoint: DispatchEndpoint): void;
}

export = EndpointBehavior;