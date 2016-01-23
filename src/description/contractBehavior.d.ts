import { ContractDescription } from "./contractDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";

/**
 * Describes a type that can be used to extend the behavior of a service contract.
 */
export interface ContractBehavior {

    /**
     * Applies the a behavior extension to a [[DispatchEndpoint]].
     * @param description The description of the contract.
     * @param endpoint The runtime endpoint.
     */
    applyContractBehavior (description: ContractDescription, endpoint: DispatchEndpoint): void;
}
