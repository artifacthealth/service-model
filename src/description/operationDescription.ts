import { OperationBehavior } from "./operationBehavior"
import { ContractDescription } from "./contractDescription";
import { Method } from "reflect-helper";

export class OperationDescription {

    name: string;
    contract: ContractDescription;
    behaviors: OperationBehavior[] = [];
    method: Method;
    isOneWay: boolean;
    timeout: number;

    constructor(contract: ContractDescription, method: Method, name?: string) {

        if(!contract) {
            throw new Error("Missing required argument 'contract'.");
        }

        if(!method) {
            throw new Error("Missing required argument 'method'.");
        }

        this.contract = contract;
        this.method = method;
        this.name = name || method.name;
    }
}
