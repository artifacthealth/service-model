import { OperationDescription } from "./operationDescription";
import { ContractBehavior } from "./contractBehavior";

export class ContractDescription {

    name: string;
    behaviors: ContractBehavior[] = [];
    operations: OperationDescription[] = [];
    version: string;

    constructor(name?: string) {

        this.name = name;
    }
}
