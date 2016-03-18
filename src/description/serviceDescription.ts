import {EndpointDescription, EndpointBehavior} from "./endpointDescription";
import {ContractDescription} from "./contractDescription";
import {OperationDescription} from "./operationDescription";
import {Url} from "../url";
import {Type, Method} from "reflect-helper";
import {RpcBehavior} from "../behaviors/rpcBehavior";
import {ContractAnnotation, OperationAnnotation} from "../annotations";
import {DispatchService} from "../dispatcher/dispatchService";

/**
 * A description of a service.
 *
 * <uml>
 * hide members
 * hide circle
 * DispatcherFactory *-- ServiceDescription : services
 * ServiceDescription *-- EndpointDescription : endpoints
 * Type -* ServiceDescription : serviceType
 * ServiceDescription *- ServiceBehavior : behaviors
 * </uml>
 */
export class ServiceDescription {

    /**
     * The name of the service.
     */
    name: string;

    /**
     * A list of behaviors that can extend the service.
     */
    behaviors: ServiceBehavior[] = [];

    /**
     * A list of endpoints for the service.
     */
    endpoints: EndpointDescription[] = [];

    /**
     * Metadata information for the concrete type that implements the service.
     */
    serviceType: Type;

    /**
     * Must be set to true when type metadata is not available. For example, when using plain JavaScript. By default an
     * error is raised if type metadata is not available.
     */
    disableMissingMetadataError: boolean;

    /**
     * A list of contracts implemented by the service.
     * @hidden
     */
    private _contracts: ContractDescription[];

    /**
     * Constructs a [[ServiceDescription]].
     * @param serviceType Metadata information for the concrete type that implements the service.
     * @param name The name of the service. If not specified, defaults to the name of the service constructor.
     */
    constructor(serviceType: Type, name?: string) {

        if(!serviceType) {
            throw new Error("Missing required argument 'serviceType'.");
        }

        this.serviceType = serviceType;
        this.name = name || serviceType.name;

        // Now go through list of all type attributes looking for any service behaviors
        this.serviceType.getAnnotations(true).forEach(annotation => {
            if(this._isServiceBehavior(annotation)) {
                this.behaviors.push(annotation);
            }
        });
    }

    /**
     * Adds an endpoint to the service.
     * @param contractName The name of the service contract handled by the endpoint.
     * @param address The base address of the endpoint.
     * @param behaviors A list of behaviors to add to the endpoint.
     */
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

        if(Array.isArray(behaviors)) {
            endpoint.behaviors = endpoint.behaviors.concat(<EndpointBehavior[]>behaviors);
        }
        else {
            endpoint.behaviors.push(<EndpointBehavior>behaviors);
        }

        return endpoint;
    }

    /**
     * Gets a contract implemented on the service, creating it if it has not yet been created.
     * @param name The name of the contract.
     * @hidden
     */
    private _ensureContract(name: string): ContractDescription {

        if(!this._contracts) {
            this._buildContracts();
        }

        return this._getContract(name);
    }

    /**
     * Returns true if the service implements the contract; otherwise, returns false.
     * @param name The name of the contract.
     * @hidden
     */
    private _hasContract(name: string): boolean {

        return !!this._getContract(name);
    }

    /**
     * Gets a contract implemented on the service.
     * @param name The name of the contract.
     * @hidden
     */
    private _getContract(name: string): ContractDescription {

        for(var i = 0; i < this._contracts.length; i++) {
            if(this._contracts[i].name == name) {
                return this._contracts[i];
            }
        }
    }

    /**
     * Builds out all contracts implemented on the service.
     * @hidden
     */
    private _buildContracts(): void {

        this._contracts = [];

        // Go through list of contract attributes stubbing out contracts and looking for duplicates
        var contactAttributes = this.serviceType.getAnnotations(ContractAnnotation, true);
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
        this.serviceType.getAnnotations(true).forEach(annotation => {
            if(this._isContractBehavior(annotation)) {
                var targetContract = this._getTargetContract(annotation);
                if(!targetContract) {
                    throw new Error("Target contract must be specified on contract behavior attribute when service has multiple contracts.");
                }

                targetContract.behaviors.push(annotation);
            }
        });

        // Go through all operations and add to appropriate contract
        for(var i = 0; i < this.serviceType.methods.length; i++) {
            var method = this.serviceType.methods[i];

            var operationAttribute = method.getAnnotations(OperationAnnotation)[0];
            if(operationAttribute) {
                var targetContract = this._getTargetContract(operationAttribute);
                if(!targetContract) {
                    throw new Error("Target contract must be specified on operation attribute when service has multiple contracts.");
                }

                this._createOperation(targetContract, operationAttribute, method);
            }
        }
    }

    /**
     * Returns true if the object is a [[ContractBehavior]].
     * @hidden
     */
    private _isContractBehavior(obj: any): boolean {

        return typeof obj["applyContractBehavior"] === "function";
    }

    /**
     * Returns true if the object is an [[OperationBehavior]].
     * @hidden
     */
    private _isOperationBehavior(obj: any): boolean {

        return typeof obj["applyOperationBehavior"] === "function";
    }

    /**
     * Returns true if the object is a [[ServiceBehavior]].
     * @hidden
     */
    private _isServiceBehavior(obj: any): boolean {

        return typeof obj["applyServiceBehavior"] === "function";
    }

    /**
     * Gets the target contract for a behavior annotation.
     * @hidden
     */
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

    /**
     * Creates the operation description for a method on the service.
     * @hidden
     */
    private _createOperation(contact: ContractDescription, operationAttribute: OperationAnnotation, method: Method): void {

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
            throw new Error(`Invalid operation '${operationDescription.name}' on service '${this.name}'. Final parameter on operation must be a callback function.`);
        }

        if(!this.disableMissingMetadataError && finalParameter && !finalParameter.type) {
            throw new Error("Missing parameter type metadata. Please make sure the --emitDecoratorMetadata option is " +
                "enabled on the TypeScript compiler. If using plain JavaScript set disableMissingMetadataError to " +
                "true on the ServiceDescription.");
        }

        this._addOperationBehaviors(operationDescription, method);

        contact.operations.push(operationDescription);
    }

    /**
     * Adds any [[OperationBehaviors]] that exist as annotations on the method.
     * @hidden
     */
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

/**
 * Describes a type that can be used to extend the behavior of a service.
 */
export interface ServiceBehavior {

    /**
     * Applies the a behavior extension to a [[DispatchService]].
     * @param description A description of the behavior.
     * @param service The runtime service.
     */
    applyServiceBehavior (description: ServiceDescription, service: DispatchService): void;
}
