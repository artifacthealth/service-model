///<reference path="../../typings/reflect-metadata.d.ts"/>

import "reflect-metadata";
import ContractDescription = require("../description/contractDescription");
import ReflectHelper = require("../description/reflectHelper");
import Constructor = require("../common/constructor");

function ServiceContract(name?: string) {

    return function(target: Constructor) {

        var contract = new ContractDescription(name || target.name);

        for(var p in target.prototype) {

            var operation = ReflectHelper.retrieveOperation(target.prototype, p);
            if(operation) {
                contract.operations.push(operation);
            }
        }

        ReflectHelper.storeContract(target, contract);
    }
}

export = ServiceContract;