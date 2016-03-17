import {ContractDescription} from "./contractDescription";
import {Url} from "../url";
import {DispatchEndpoint} from "../dispatcher/dispatchEndpoint";

/**
 * A description of a service endpoint.
 *
 * <uml>
 * hide members
 * hide circle
 * ServiceDescription *-- EndpointDescription : endpoints
 * EndpointDescription *-- ContractDescription : contract
 * Url -* EndpointDescription : address
 * EndpointDescription *- EndpointBehavior : behaviors
 * </uml>
 */
export class EndpointDescription {

    /**
     * A list of behaviors that extend the service endpoint.
     */
    behaviors: EndpointBehavior[] = [];

    /**
     * The contract for the endpoint.
     */
    contract: ContractDescription;

    /**
     * The base address for the endpoint.
     */
    address: Url;

    /**
     * Constructs an [[EndpointDescription]]
     * @param contract The contract for the endpoint.
     * @param address The base address for the endpoint.
     */
    constructor(contract: ContractDescription, address: Url | string) {

        if(!contract) {
            throw new Error("Missing required argument 'contract'.");
        }

        if(!address) {
            throw new Error("Missing required argument 'address'.");
        }

        this.address = new Url(address);
        this.contract = contract;
    }
}

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
