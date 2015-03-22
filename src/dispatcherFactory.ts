/// <reference path="../typings/node.d.ts" />

import util = require("util");
import reflect = require("tsreflect");

import Constructor = require("./common/constructor");
import RequestDispatcher = require("./dispatcher/requestDispatcher");
import ServiceDescription = require("./description/serviceDescription");
import DispatchService = require("./dispatcher/dispatchService");
import EndpointDescription = require("./description/endpointDescription");
import DispatchEndpoint = require("./dispatcher/dispatchEndpoint");
import OperationDescription = require("./description/operationDescription");
import DispatchOperation = require("./dispatcher/dispatchOperation");
import DefaultOperationInvoker = require("./dispatcher/defaultOperationInvoker");
import DefaultInstanceProvider = require("./dispatcher/defaultInstanceProvider");
import ServiceBehavior = require("./description/serviceBehavior");
import EndpointBehavior = require("./description/endpointBehavior");
import ContractBehavior = require("./description/contractBehavior");
import OperationBehavior = require("./description/operationBehavior");
import ContractDescription = require("./description/contractDescription");
import RpcOperationSelector = require("./dispatcher/rpcOperationSelector");
import RpcMessageFormatter = require("./dispatcher/rpcMessageFormatter");
import RpcFaultFormatter = require("./dispatcher/rpcFaultFormatter");
import Url = require("./url");
import Lookup = require("./common/lookup");

class DispatcherFactory {

    private _services: ServiceDescription[] = [];
    private _loadedSymbols: boolean;
    private _behaviors: Lookup<ServiceBehavior | ContractBehavior | OperationBehavior> = {};

    addService(ctr: Constructor, name?: string): ServiceDescription {

        if(!ctr) {
            throw new Error("Missing required argument 'ctr'.");
        }

        if(!this._loadedSymbols) {
            reflect.loadSync();
            this._loadedSymbols = true;
        }

        var symbol = reflect.getSymbol(ctr);
        if(!symbol) {
            throw new Error("Unable to find symbol information for '" + ctr.name + "'. Make sure you have a .d.json file in the same directory as as the module containing this constructor. See tsreflect-compiler on npm for more information.");
        }

        var service = new ServiceDescription(symbol, name || symbol.getName());
        this._services.push(service);
        return service;
    }

    registerBehavior(annotationName: string, behavior: ServiceBehavior | ContractBehavior | OperationBehavior): void {

        if(!annotationName) {
            throw new Error("Missing required argument 'ctr'.");
        }

        if(!behavior) {
            throw new Error("Missing required argument 'behavior'.");
        }

        if(this._behaviors[annotationName]) {
            throw new Error("A behavior has already been register for annotation name '" + annotationName + "'.");
        }

        this._behaviors[annotationName] = behavior;
    }

    createDispatcher(): RequestDispatcher {

        // Build the request dispatcher
        var dispatcher = new RequestDispatcher();
        for(var i = 0; i < this._services.length; i++) {
            dispatcher.services.push(this._createDispatchService(dispatcher, this._services[i]));
        }

        // Apply behaviors
        for(var i = 0; i < this._services.length; i++) {
            this._applyServiceBehaviors(dispatcher.services[i], this._services[i]);
        }

        dispatcher.validate();

        return dispatcher;
    }

    private _createDispatchService(dispatcher: RequestDispatcher, service: ServiceDescription): DispatchService {

        var ret = new DispatchService(dispatcher, service.name);

        for(var i = 0; i < service.endpoints.length; i++) {
            ret.endpoints.push(this._createDispatchEndpoint(ret, service.endpoints[i]));
        }

        ret.instanceProvider = new DefaultInstanceProvider(service);

        return ret;
    }

    private _createDispatchEndpoint(service: DispatchService, endpoint: EndpointDescription): DispatchEndpoint {

        var ret = new DispatchEndpoint(service, endpoint.address, endpoint.contract.name);

        for(var i = 0; i < endpoint.contract.operations.length; i++) {
            ret.operations.push(this._createDispatchOperation(ret, endpoint.contract.operations[i]));
        }

        return ret;
    }

    private _createDispatchOperation(endpoint: DispatchEndpoint, operation: OperationDescription): DispatchOperation {

        var ret = new DispatchOperation(endpoint, operation.name);
        ret.isOneWay = operation.isOneWay;
        ret.invoker = new DefaultOperationInvoker(operation);
        return ret;
    }

    private _applyServiceBehaviors(service: DispatchService, description: ServiceDescription): void {

        // apply service behaviors
        description.behaviors.forEach(behavior => behavior.applyServiceBehavior(description, service));

        // apply contract behaviors
        for(var i = 0; i < description.endpoints.length; i++) {
            this._applyContractBehaviors(service.endpoints[i], description.endpoints[i].contract);
        }

        // apply endpoint behaviors
        for(var i = 0; i < description.endpoints.length; i++) {
            this._applyEndpointBehaviors(service.endpoints[i], description.endpoints[i]);
        }

        // apply operation behaviors
        for(var i = 0; i < description.endpoints.length; i++) {
            var operations = description.endpoints[i].contract.operations;
            for (var j = 0; j < operations.length; j++) {
                this._applyOperationBehaviors(service.endpoints[i].operations[j], operations[j]);
            }
        }
    }

    private _applyEndpointBehaviors(endpoint: DispatchEndpoint, description: EndpointDescription): void {

        description.behaviors.forEach(behavior => behavior.applyEndpointBehavior(description, endpoint));
    }

    private _applyContractBehaviors(endpoint: DispatchEndpoint, description: ContractDescription): void {

        description.behaviors.forEach(behavior => behavior.applyContractBehavior(description, endpoint));
    }

    private _applyOperationBehaviors(operation: DispatchOperation, description: OperationDescription): void {

        description.behaviors.forEach(behavior => behavior.applyOperationBehavior(description, operation));
    }
}

export = DispatcherFactory;