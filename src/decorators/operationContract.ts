///<reference path="../../typings/reflect-metadata.d.ts"/>

import "reflect-metadata";
import ContractDescription = require("../description/contractDescription");
import OperationDescription = require("../description/operationDescription");
import OperationContractOptions = require("./operationContractOptions");
import Method = require("../description/method");
import ReflectHelper = require("../description/reflectHelper");
import Constructor = require("../common/constructor");

function OperationContract(options?: OperationContractOptions) {

    return function (target: any, methodName: string) {

        // create a method descriptor with the type information
        var method = new Method(methodName);
        method.parameters = ReflectHelper.getParameters(target, methodName);
        method.returnType = ReflectHelper.getReturnType(target, methodName);

        if(!method.parameters) {
            throw new Error("Missing type metadata. Please make sure the --emitDecoratorMetadata option is enabled on the TypeScript compiler.");
        }

        // create the operation contract and add to the service contract
        var operationDescription = new OperationDescription(method, options ? options.name : undefined);

        if(options) {
            if(options.isOneWay !== undefined) {
                operationDescription.isOneWay = options.isOneWay;
            }

            if(options.timeout !== undefined) {
                operationDescription.timeout = options.timeout;
            }
        }

        if(method.parameters.length > 0 && method.parameters[method.parameters.length-1].type === Function) {
            operationDescription.isAsync = true;
        }

        ReflectHelper.storeOperation(target, methodName, operationDescription);
    }
}


export = OperationContract;
