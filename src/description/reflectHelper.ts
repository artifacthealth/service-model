import Constructor = require("../common/constructor");
import ContractDescription = require("./contractDescription");
import OperationDescription = require("./operationDescription");
import Parameter = require("./parameter");

export function storeContract(ctr: Constructor, contract: ContractDescription): void {

    Reflect.defineMetadata("servicemodel:contract", contract, ctr);
}

export function retrieveContract(ctr: Constructor, name?: string): ContractDescription {

    var contract = <ContractDescription>Reflect.getMetadata("servicemodel:contract", ctr);
    if(contract && (!name || contract.name == name)) {
        return contract;
    }
}

export function storeOperation(ctr: Constructor, method: string, contract: OperationDescription): void {

    Reflect.defineMetadata("servicemodel:operation", contract, ctr, method);
}

export function retrieveOperation(ctr: Constructor, method: string): OperationDescription {

    return <OperationDescription>Reflect.getMetadata("servicemodel:operation", ctr, method);
}

export function getReturnType(ctr: Constructor, method: string): Object {

    return Reflect.getMetadata('design:returntype', ctr, method)
}

export function getParameters(ctr: Constructor, method: string): Parameter[] {

    var types = getParameterTypes(ctr, method),
        names = getParameterNames((<any>ctr)[method]),
        params: Parameter[] = new Array(types.length);

    for(var i = 0; i < params.length; i++) {
        params[i] = {
            name: names[i],
            type: types[i]
        }
    }

    return params;
}


export function getParameterTypes(ctr: Constructor, method: string): Object[] {

    return Reflect.getMetadata('design:paramtypes', ctr, method);
}

// Code below for getParameterNames is modified code from AngularJS
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;


function getParameterNames(fn: Function): string[] {

    if(typeof fn === "function") {

        var names: string[] = [];

        var fnText = fn.toString().replace(STRIP_COMMENTS, '');
        var argDecl = fnText.match(FN_ARGS);
        argDecl[1].split(FN_ARG_SPLIT).forEach((arg: string) => {
            names.push(arg.trim());
        });

        return names;
    }
}

