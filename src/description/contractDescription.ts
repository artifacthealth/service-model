import OperationDescription = require("./operationDescription");
import ContractBehavior = require("./contractBehavior");

class ContractDescription {

    name: string;
    behaviors: ContractBehavior[] = [];
    operations: OperationDescription[] = [];
    version: string;

    constructor(name?: string) {

        this.name = name;
    }
}

export = ContractDescription;