/// <reference path="../common/types.d.ts" />

import reflect = require("tsreflect");
import OperationDescription = require("./operationDescription");
import ContractBehavior = require("./contractBehavior");

class ContractDescription {

    name: string;
    behaviors: ContractBehavior[] = [];
    operations: OperationDescription[] = [];
    contractType: reflect.Type;
    version: string;

    constructor(contractType: reflect.Type, name?: string) {

        this.contractType = contractType;
        this.name = name || contractType.getName();

        if(!contractType.isInterface()) {
            this._throwInvalidContract("Contract type must be an Interface.");
        }

        var annotations = contractType.getAnnotations("serviceContract");
        if(annotations.length == 0) {
            this._throwInvalidContract("Contract type must be annotated with the @serviceContract annotation.")
        }

        this._processServiceContractAnnotation(annotations[0]);

        var properties = this.contractType.getProperties();
        for(var i = 0; i < properties.length; i++) {
            var property = properties[i];
            if(property.isMethod()) {
                this.operations.push(new OperationDescription(this, property));
            }
        }
    }

    private _processServiceContractAnnotation(annotation: reflect.Annotation): void {
        if(typeof annotation !== "object") {
            return;
        }

        if(annotation.value.name !== undefined) {
            if(typeof annotation.value.name != "string") {
                this._throwAnnotationError("Expected string for property 'name'.");
            }
            this.name = annotation.value.name;
        }

        if(annotation.value.version !== undefined) {
            if(typeof annotation.value.version != "string") {
                this._throwAnnotationError("Expected string for property 'version'.");
            }
            this.version = annotation.value.version;
        }
    }

    private _throwAnnotationError(message: string): void {
        this._throwInvalidContract("Invalid annotation 'serviceContract'. " + message);
    }

    private _throwInvalidContract(message?: string): void {
        throw new Error("Invalid contract '" + this.name + "'." + (message ? " " + message : ""));
    }
}

export = ContractDescription;