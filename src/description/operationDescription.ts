import OperationBehavior = require("./operationBehavior")
import ContractDescription = require("./contractDescription");
import Method = require("./method");

class OperationDescription {

    name: string;
    contract: ContractDescription;
    behaviors: OperationBehavior[] = [];
    method: Method;
    isOneWay: boolean;
    isAsync: boolean;
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

export = OperationDescription;