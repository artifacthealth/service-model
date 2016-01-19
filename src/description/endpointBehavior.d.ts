import { EndpointDescription } from "./endpointDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";

export interface EndpointBehavior {

    applyEndpointBehavior (description: EndpointDescription, endpoint: DispatchEndpoint): void;
}
