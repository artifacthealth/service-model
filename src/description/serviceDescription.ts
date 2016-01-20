import { EndpointDescription } from "./endpointDescription";
import { EndpointBehavior } from "./endpointBehavior";
import { ContractDescription } from "./contractDescription";
import { OperationDescription } from "./operationDescription";
import { ServiceBehavior } from "./serviceBehavior";
import { Url } from "../url";
import { Constructor } from "../common/constructor";
import { ContractAttribute, OperationAttribute } from "../attributes";
import { Type, Method } from "reflect-helper";

export class ServiceDescription {

    name: string;
    behaviors: ServiceBehavior[] = [];
    endpoints: EndpointDescription[] = [];
    serviceType: Type;

    private _contracts: ContractDescription[];

    constructor(serviceType: Type, name?: string) {

        if(!serviceType) {
            throw new Error("Missing required argument 'serviceType'.");
        }

        this.serviceType = serviceType;
        this.name = name || serviceType.name;
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
        var contactAttributes = this.serviceType.getAnnotations(ContractAttribute);
        for(var i = 0; i < contactAttributes.length; i++) {
            var contactAttribute = contactAttributes[i];
            if(this._hasContract(contactAttribute.name)) {
                throw new Error("Duplicate contract with name '" + contactAttribute.name + "' on service '" + this.serviceType.name + "'.");
            }

            var contact = new ContractDescription(contactAttribute.name);
            this._contracts.push(contact);
        }

        if(this._contracts.length == 0) {
            return;
        }

        // Now go through list of all type attributes looking for any contract behaviors
        var attributes = this.serviceType.getAnnotations();
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
        for(var i = 0; i < this.serviceType.methods.length; i++) {
            var method = this.serviceType.methods[i];

            var operationAttribute = method.getAnnotations(OperationAttribute)[0];
            if(operationAttribute) {
                var targetContract = this._getTargetContract(operationAttribute);
                if(!targetContract) {
                    throw new Error("Target contract must be specified on operation attribute when service has multiple contracts.");
                }

                this._createOperation(targetContract, operationAttribute, method);
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

    private _createOperation(contact: ContractDescription, operationAttribute: OperationAttribute, method: Method): void {

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

        var finalParameter = method.parameters.length > 0 && method.parameters[method.parameters.length-1];
        if(!finalParameter || (finalParameter.type && !finalParameter.type.isFunction)) {
            throw new Error("Final parameter on operation must be a callback function.");
        }

        if(finalParameter && !finalParameter.type) {
            throw new Error("Missing parameter type metadata. Please make sure the --emitDecoratorMetadata option is enabled on the TypeScript compiler.");
        }

        this._addOperationBehaviors(operationDescription, method);

        contact.operations.push(operationDescription);
    }

    private _addOperationBehaviors(description: OperationDescription, method: Method): void {

        var attributes = method.getAnnotations();
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
