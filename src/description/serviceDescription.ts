import util = require("util");
import EndpointDescription = require("./endpointDescription");
import EndpointBehavior = require("./endpointBehavior");
import ContractDescription = require("./contractDescription");
import OperationDescription = require("./operationDescription");
import ServiceBehavior = require("./serviceBehavior");
import Url = require("../url");
import Constructor = require("../common/constructor");
import ReflectHelper = require("../common/reflectHelper");
import { ContractAttribute, OperationAttribute } from "../attributes";
import Method = require("./method");

class ServiceDescription {

    name: string;
    behaviors: ServiceBehavior[] = [];
    endpoints: EndpointDescription[] = [];
    serviceConstructor: Constructor<any>;

    private _contracts: ContractDescription[];

    constructor(serviceConstructor: Constructor<any>, name?: string) {

        if(!serviceConstructor) {
            throw new Error("Missing required argument 'serviceConstructor'.");
        }

        this.serviceConstructor = serviceConstructor;
        this.name = name || serviceConstructor.name;
    }

    addEndpoint(contractName: string, address: Url | string, behaviors?: EndpointBehavior | EndpointBehavior[]): EndpointDescription {

        if(!contractName) {
            throw new Error("Missing required argument 'contractName'.");
        }

        if(!address) {
            throw new Error("Missing required argument 'address'.");
        }


        var contract = this._ensureContract(contractName);
        if (!contract) {
            throw new Error("Contract '" + contractName + "' not found on service '" + this.name + "'.");
        }

        var endpoint = new EndpointDescription(contract, address);
        this.endpoints.push(endpoint);

        if(behaviors) {
            if(Array.isArray(behaviors)) {
                endpoint.behaviors = endpoint.behaviors.concat(<EndpointBehavior[]>behaviors);
            }
            else {
                endpoint.behaviors.push(<EndpointBehavior>behaviors);
            }
        }

        return endpoint;
    }

    private _ensureContract(name: string): ContractDescription {

        if(!this._contracts) {
            this._buildContracts();
        }

        return this._getContract(name);
    }

    private _hasContract(name: string): boolean {

        return !!this._getContract(name);
    }

    private _getContract(name: string): ContractDescription {

        for(var i = 0; i < this._contracts.length; i++) {
            if(this._contracts[i].name == name) {
                return this._contracts[i];
            }
        }
    }

    private _buildContracts(): void {

        this._contracts = [];

        // Go through list of contract attributes stubbing out contracts and looking for duplicates
        var contactAttributes = ReflectHelper.getOwnAttributes(ContractAttribute, this.serviceConstructor);
        for(var i = 0; i < contactAttributes.length; i++) {
            var contactAttribute = contactAttributes[i];
            if(this._hasContract(contactAttribute.name)) {
                throw new Error("Duplicate contract with name '" + contactAttribute.name + "' on service '" + this.serviceConstructor.name + "'.");
            }

            var contact = new ContractDescription(contactAttribute.name);
            this._contracts.push(contact);
        }

        if(this._contracts.length == 0) {
            return;
        }

        // Now go through list of all type attributes looking for any contract behaviors
        var attributes = ReflectHelper.getOwnAttributes(this.serviceConstructor);
        for(var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];

            if(this._isContractBehavior(attribute)) {
                var targetContract = this._getTargetContract(attribute);
                if(!targetContract) {
                    throw new Error("Target contract must be specified on contract behavior attribute when service has multiple contracts.");
                }

                targetContract.behaviors.push(attribute);
            }
        }

        // Go through all operations and add to appropriate contract
        for(var propertyName in this.serviceConstructor.prototype) {

            if(this.serviceConstructor.prototype.hasOwnProperty(propertyName)) {
                var operationAttribute = ReflectHelper.getOwnAttributes(OperationAttribute, this.serviceConstructor.prototype, propertyName)[0];
                if(operationAttribute) {
                    var targetContract = this._getTargetContract(operationAttribute);
                    if(!targetContract) {
                        throw new Error("Target contract must be specified on operation attribute when service has multiple contracts.");
                    }

                    this._createOperation(targetContract, operationAttribute, propertyName);
                }
            }
        }
    }

    private _isContractBehavior(obj: any): boolean {

        return typeof obj["applyContractBehavior"] === "function";
    }

    private _isOperationBehavior(obj: any): boolean {

        return typeof obj["applyOperationBehavior"] === "function";
    }

    private _getTargetContract(obj: any): ContractDescription {

        // If target contract is specified, look it up.
        var contractName = obj["contract"];
        if(contractName) {
            var contract = this._getContract(contractName);
            if(!contract) {
                throw new Error("Could not find target contract '" + contractName + "'.");
            }
            return contract;
        }

        // If target contract is not specified, return the first contract if one only have one.
        if(this._contracts.length === 1) {
            return this._contracts[0];
        }

        return null;
    }

    private _createOperation(contact: ContractDescription, operationAttribute: OperationAttribute, methodName: string): void {

        // create a method descriptor with the type information
        var method = new Method(methodName);
        method.parameters = ReflectHelper.getParameters(this.serviceConstructor.prototype, methodName);
        method.returnType = ReflectHelper.getReturnType(this.serviceConstructor.prototype, methodName);

        if(!method.parameters) {
            throw new Error("Missing type metadata. Please make sure the --emitDecoratorMetadata option is enabled on the TypeScript compiler.");
        }

        // create the operation contract and add to the service contract
        var operationDescription = new OperationDescription(contact, method, operationAttribute ? operationAttribute.name : undefined);

        if(operationAttribute) {
            if(operationAttribute.isOneWay !== undefined) {
                operationDescription.isOneWay = operationAttribute.isOneWay;
            }

            if(operationAttribute.timeout !== undefined) {
                operationDescription.timeout = operationAttribute.timeout;
            }
        }

        if(method.parameters.length > 0 && method.parameters[method.parameters.length-1].type === Function) {
            operationDescription.isAsync = true;
        }

        this._addOperationBehaviors(operationDescription, methodName);

        contact.operations.push(operationDescription);
    }

    private _addOperationBehaviors(description: OperationDescription, methodName: string): void {

        var attributes = ReflectHelper.getOwnAttributes(this.serviceConstructor.prototype, methodName);
        for(var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            if(this._isOperationBehavior(attribute)) {
                var targetContract = this._getTargetContract(attribute);
                if(!targetContract) {
                    throw new Error("Target contract must be specified on operation behavior when service has multiple contracts.");
                }

                if(targetContract === description.contract) {
                    description.behaviors.push(attribute);
                }
            }
        }
    }
}

export = ServiceDescription;