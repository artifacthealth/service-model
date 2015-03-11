/// <reference path="../common/types.d.ts" />

import reflect = require("tsreflect");
import OperationDescription = require("./operationDescription");
import ContractBehavior = require("./contractBehavior");

class ContractDescription {

    name: string;
    behaviors: ContractBehavior[] = [];
    operations: OperationDescription[] = [];
    contractType: reflect.Type;

    constructor(contractType: reflect.Type, name?: string) {

        this.contractType = contractType;
        this.name = name || contractType.getName();

        var properties = this.contractType.getProperties();
        for(var i = 0; i < properties.length; i++) {
            var property = properties[i];
            if(property.isMethod()) {
                this.operations.push(new OperationDescription(this, property));
            }
        }
    }
}

export = ContractDescription;