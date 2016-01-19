import { Constructor } from "./common/constructor";
import { RequestDispatcher } from "./dispatcher/requestDispatcher";
import { ServiceDescription } from "./description/serviceDescription";
import { DispatchService } from "./dispatcher/dispatchService";
import { EndpointDescription } from "./description/endpointDescription";
import { DispatchEndpoint } from "./dispatcher/dispatchEndpoint";
import { OperationDescription } from "./description/operationDescription";
import { DispatchOperation } from "./dispatcher/dispatchOperation";
import { DefaultOperationInvoker } from "./dispatcher/defaultOperationInvoker";
import { DefaultInstanceProvider } from "./dispatcher/defaultInstanceProvider";
import { ServiceBehavior } from "./description/serviceBehavior";
import { EndpointBehavior } from "./description/endpointBehavior";
import { ContractBehavior } from "./description/contractBehavior";
import { OperationBehavior } from "./description/operationBehavior";
import { ContractDescription } from "./description/contractDescription";
import { RpcOperationSelector } from "./dispatcher/rpcOperationSelector";
import { RpcMessageFormatter } from "./dispatcher/rpcMessageFormatter";
import { RpcFaultFormatter } from "./dispatcher/rpcFaultFormatter";
import { Url } from "./url";

export class DispatcherFactory {

    private _services: ServiceDescription[] = [];

    addService(ctr: Constructor<any>, name?: string): ServiceDescription {

        if(!ctr) {
            throw new Error("Missing required argument 'ctr'.");
        }

        var service = new ServiceDescription(ctr, name || ctr.name);
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
        var invoker = new DefaultOperationInvoker(operation);;
        if(operation.timeout != undefined) {
            invoker.timeout = operation.timeout;
        }
        ret.invoker = invoker;
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
