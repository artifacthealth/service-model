/// <reference path="./common/types.d.ts" />

import reflect = require("tsreflect");
import changeCase = require("change-case");

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
import Url = require("./url");

class DispatcherFactory {

    private _services: ServiceDescription[] = [];
    private _loadedSymbols: boolean;
    private _baseAddress: Url;

    constructor(baseAddress?: Url | string) {

        this._baseAddress = new Url(baseAddress);
    }

    addService(ctr: Constructor, baseAddress?: Url | string, name?: string): ServiceDescription {

        if(!this._loadedSymbols) {
            reflect.loadSync();
            this._loadedSymbols = true;
        }

        var symbol = reflect.getSymbol(ctr);
        if(!symbol) {
            throw new Error("Unable to find symbol information for '" + ctr.name + "'. Make sure you have a .d.json file in the same directory as as the module containing this constructor. See tsreflect-compiler on npm for more information.");
        }

        var serviceName = name || symbol.getName();
        var url = baseAddress ? new Url(baseAddress) : (this._baseAddress.resolve(changeCase.paramCase(serviceName)));

        // validate that base address is unique
        for(var i = 0; i < this._services.length; i++) {
            if(this._services[i].baseAddress.equals(url)) {
                throw new Error("There is already a service with base address '" + url + "'.");
            }
        }

        var service = new ServiceDescription(symbol, url, serviceName);
        this._services.push(service);
        return service;
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

        return dispatcher;
    }

    private _createDispatchService(dispatcher: RequestDispatcher, service: ServiceDescription): DispatchService {

        var ret = new DispatchService(dispatcher, service.baseAddress, service.name);

        for(var i = 0; i < service.endpoints.length; i++) {
            ret.endpoints.push(this._createDispatchEndpoint(ret, service, service.endpoints[i]));
        }

        return ret;
    }

    private _createDispatchEndpoint(service: DispatchService, serviceDescription: ServiceDescription, endpoint: EndpointDescription): DispatchEndpoint {

        var ret = new DispatchEndpoint(service, endpoint.address, endpoint.name);

        for(var i = 0; i < endpoint.contract.operations.length; i++) {
            ret.operations.push(this._createDispatchOperation(ret, endpoint.contract.operations[i]));
        }

        ret.instanceProvider = new DefaultInstanceProvider(serviceDescription);
        ret.operationSelector = new RpcOperationSelector(ret);

        return ret;
    }

    private _createDispatchOperation(endpoint: DispatchEndpoint, operation: OperationDescription): DispatchOperation {

        var ret = new DispatchOperation(endpoint, operation.name);
        ret.isOneWay = operation.isOneWay;
        ret.invoker = new DefaultOperationInvoker(operation);
        ret.formatter = new RpcMessageFormatter(operation);
        return ret;
    }

    private _applyServiceBehaviors(service: DispatchService, description: ServiceDescription): void {

        description.behaviors.forEach(behavior => behavior.applyBehavior(description, service));

        for(var i = 0; i < description.endpoints.length; i++) {
            this._applyEndpointBehaviors(service.endpoints[i], description.endpoints[i]);
        }

        for(var i = 0; i < description.endpoints.length; i++) {
            this._applyContractBehaviors(service.endpoints[i], description.endpoints[i].contract);
        }
    }

    private _applyEndpointBehaviors(endpoint: DispatchEndpoint, description: EndpointDescription): void {

        description.behaviors.forEach(behavior => behavior.applyBehavior(description, endpoint));
    }

    private _applyContractBehaviors(endpoint: DispatchEndpoint, description: ContractDescription): void {

        description.behaviors.forEach(behavior => behavior.applyBehavior(description, endpoint));

        for(var i = 0; i < description.operations.length; i++) {
            this._applyOperationBehaviors(endpoint.operations[i], description.operations[i]);
        }
    }

    private _applyOperationBehaviors(operation: DispatchOperation, description: OperationDescription): void {

        description.behaviors.forEach(behavior => behavior.applyBehavior(description, operation));
    }
}

export = DispatcherFactory;