import OperationBehavior = require("./operationBehavior")
import ContractDescription = require("./contractDescription");
import Method = require("./method");

class OperationDescription {

    name: string;
    behaviors: OperationBehavior[] = [];
    method: Method;
    isOneWay: boolean;
    isAsync: boolean;
    timeout: number;

    constructor(method: Method, name?: string) {

        if(!method) {
            throw new Error("Missing required argument 'method'.");
        }

        this.method = method;
        this.name = name || method.name;
    }
}

export = OperationDescription;