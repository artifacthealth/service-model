import { EndpointDescription } from "./endpointDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";

/**
 * Describes a type that can be used to extend the behavior of an endpoint.
 */
export interface EndpointBehavior {

    /**
     * Applies the a behavior extension to a [[DispatchEndpoint]].
     * @param description A description of the endpoint.
     * @param endpoint The runtime endpoint.
     */
    applyEndpointBehavior (description: EndpointDescription, endpoint: DispatchEndpoint): void;
}
