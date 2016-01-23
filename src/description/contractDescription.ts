import { OperationDescription } from "./operationDescription";
import { ContractBehavior } from "./contractBehavior";

/**
 * A description of a service contract.
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
