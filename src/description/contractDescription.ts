import {OperationDescription} from "./operationDescription";
import {DispatchEndpoint} from "../dispatcher/dispatchEndpoint";

/**
 * A description of a service contract.
 *
 * <uml>
 * hide members
 * hide circle
 * EndpointDescription *-- ContractDescription : contract
 * ContractDescription *-- OperationDescription : operations
 * ContractDescription *- ContractBehavior : behaviors
 * </uml>
 */
export class ContractDescription {

    /**
     * The name of the contract.
     */
    name: string;

    /**
     * A list of behavior extensions for the contract.
     */
    behaviors: ContractBehavior[] = [];

    /**
     * A list of operations that are a part of the contract.
     */
    operations: OperationDescription[] = [];


    constructor(name?: string) {

        this.name = name;
    }
}

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

/**
 * Describes a behavior that can be applied to a contract or operation using an annotation.
 */
export interface BehaviorAnnotation {

    /**
     * The name of the contract that is the target of the behavior annotation. This is needed for [[OperationBehavior]] and
     * [[ContractBehavior]] classes that may be specified as attributes on services when the service has more than one
     * contract defined.
     */
    contract: string;
}
