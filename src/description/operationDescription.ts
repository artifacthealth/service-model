/// <reference path="../../typings/tsreflect.d.ts" />

import reflect = require("tsreflect");
import OperationBehavior = require("./operationBehavior")
import ContractDescription = require("./contractDescription");

class OperationDescription {

    contract: ContractDescription;
    name: string;
    behaviors: OperationBehavior[] = [];
    method: reflect.Symbol;
    returnType: reflect.Type;
    isOneWay: boolean;
    isAsync: boolean;
    timeout: number;

    constructor(contract: ContractDescription, method: reflect.Symbol, name?: string) {

        if(!contract) {
            throw new Error("Missing required argument 'contract'.");
        }

        if(!method) {
            throw new Error("Missing required argument 'method'.");
        }

        this.contract = contract;
        this.method = method;
        this.name = name || method.getName();

        this._processSignature();
    }

    private _processSignature(): void {

        var annotations = this.method.getAnnotations("operationContract");
        if(annotations.length > 0) {
            this._processOperationContractAnnotation(annotations[0]);
        }

        var signatures = this.method.getType().getCallSignatures();
        if(signatures.length > 1) {
            this._throwInvalidOperation("Method overloading is not supported.");
        }

        var parameters = signatures[0].getParameters();

        // check the signature to make sure it conforms to sync or async
        for(var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i];

            // check if parameter has a call signature
            var parameterType = parameter.getType();
            if(parameterType.isObjectType() && parameterType.getCallSignatures().length > 0) {
                if(i != parameters.length - 1) {
                    this._throwInvalidOperation("Callbacks are only allowed as the last parameter.");
                }

                this.isAsync = true;
                this._validateCallbackSignature(parameterType.getCallSignatures()[0]);
            }
        }

        if(!this.isAsync) {
            this.returnType = signatures[0].getReturnType();
        }
    }

    private _processOperationContractAnnotation(annotation: reflect.Annotation): void {
        if(typeof annotation !== "object") {
            return;
        }

        if(annotation.value.isOneWay !== undefined) {
            if(typeof annotation.value.isOneWay != "boolean") {
                this._throwAnnotationError("Expected boolean for property 'isOneWay'.");
            }
            this.isOneWay = annotation.value.isOneWay;
        }

        if(annotation.value.name !== undefined) {
            if(typeof annotation.value.name != "string") {
                this._throwAnnotationError("Expected string for property 'name'.");
            }
            this.name = annotation.value.name;
        }

        if(annotation.value.timeout !== undefined) {
            if(typeof annotation.value.timeout != "number") {
                this._throwAnnotationError("Expected number for property 'timeout'.");
            }
            this.timeout = annotation.value.timeout;
        }
    }

    private _throwAnnotationError(message: string): void {
        this._throwInvalidOperation("Invalid annotation 'operationContract'. " + message);
    }

    private _validateCallbackSignature(signature: reflect.Signature): void {

        var parameters = signature.getParameters();
        if(parameters.length == 0) {
            throw new Error("Callback must have at least one parameter.");
        }

        if(parameters.length > 2) {
            throw new Error("Callback can have no more than two parameters.");
        }

        if(!parameters[0].getType().isAssignableTo(reflect.resolve("Error").getDeclaredType())) {
            throw new Error("First parameter of callback must be an Error object.");
        }

        if(parameters.length == 2) {
            this.returnType = parameters[1].getType();
        }
        else {
            // If no result parameter in callback then set the return type to 'void'
            this.returnType = reflect.resolve("void").getType();
        }
    }

    private _throwInvalidOperation(message?: string): void {

        throw new Error("Invalid operation '" + this.name + "' on contract '" + this.contract.name + "'." + (message ? " " + message : ""));
    }
}

export = OperationDescription;