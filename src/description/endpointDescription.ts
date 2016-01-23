import { ContractDescription } from "./contractDescription";
import { EndpointBehavior } from "./endpointBehavior";
import { Url } from "../url";

/**
 * A description of a service endpoint.
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
