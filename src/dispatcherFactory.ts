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
import { ReflectContext } from "reflect-helper";

/**
 * The DispatcherFactory is the primary class used to configure the service model, and is responsible for creating the
 * [[RequestDispatcher]] based on the service descriptions.
 *
 * <uml>
 * hide members
 * hide circle
 * DispatcherFactory *-- ServiceDescription : services
 * ServiceDescription *-- EndpointDescription : endpoints
 * ServiceDescription *- ServiceBehavior : behaviors
 * EndpointDescription *-- ContractDescription : contract
 * EndpointDescription *- EndpointBehavior : behaviors
 * ContractDescription *-- OperationDescription : operations
 * ContractDescription *- ContractBehavior : behaviors
 * OperationDescription *- OperationBehavior : behaviors
 * </uml>
 *
 * ### Example
 *
 * Once our service is defined, we add it to a DispatcherFactory. We then add an endpoint to the service,
 * providing the name of the contract, the base address for the endpoint, and a list of endpoint behaviors.
 *
 * ```typescript
 * import { DispatcherFactory, RpcBehavior } from "service-model";
 *
 * var factory = new DispatcherFactory();
 *
 * factory.addService(CalculatorService)
 *             .addEndpoint("Calculator", "/api/calculator", [new RpcBehavior()]);
 * ```
 *
 * In this case, we add the [[RpcBehavior]] which indicates that operations on this endpoint will be available
 * through RPC.
 */
export class DispatcherFactory {

    /**
     * List of service descriptions configured for the dispatcher factory.
     */
    services: ServiceDescription[] = [];

    /**
     * @hidden
     */
    private _context = new ReflectContext();

    /**
     * Adds a service.
     * @param ctr The constructor for the service.
     * @param name The name of the service. If not specified the name of the constructor is used.
     */
    addService(ctr: Constructor<any>, name?: string): ServiceDescription {

        if(!ctr) {
            throw new Error("Missing required argument 'ctr'.");
        }

        var service = new ServiceDescription(this._context.getType(ctr), name);
        this.services.push(service);
        return service;
    }

    /**
     * Creates a request dispatcher used for dispatching service requests.
     */
    createDispatcher(): RequestDispatcher {

        // Build the request dispatcher
        var dispatcher = new RequestDispatcher();
        for(var i = 0; i < this.services.length; i++) {
            dispatcher.services.push(this._createDispatchService(dispatcher, this.services[i]));
        }

        // Apply behaviors
        for(var i = 0; i < this.services.length; i++) {
            this._applyServiceBehaviors(dispatcher.services[i], this.services[i]);
        }

        dispatcher.validate();

        return dispatcher;
    }

    /**
     * Creates a dispatch service based on the service description.
     * @param dispatcher The dispatcher.
     * @param service The service description.
     * @hidden
     */
    private _createDispatchService(dispatcher: RequestDispatcher, service: ServiceDescription): DispatchService {

        var ret = new DispatchService(dispatcher, service.name);

        for(var i = 0; i < service.endpoints.length; i++) {
            ret.endpoints.push(this._createDispatchEndpoint(ret, service.endpoints[i]));
        }

        ret.instanceProvider = new DefaultInstanceProvider(service);

        return ret;
    }

    /**
     * Creates a dispatch endpoint based on an endpoint description.
     * @param service The dispatch service.
     * @param endpoint The endpoint description.
     * @hidden
     */
    private _createDispatchEndpoint(service: DispatchService, endpoint: EndpointDescription): DispatchEndpoint {

        var ret = new DispatchEndpoint(service, endpoint.address, endpoint.contract.name);

        for(var i = 0; i < endpoint.contract.operations.length; i++) {
            ret.operations.push(this._createDispatchOperation(ret, endpoint.contract.operations[i]));
        }

        return ret;
    }

    /**
     * Creates a dispatch operation based on an operation description.
     * @param endpoint The dispatch endpoint.
     * @param operation The operation description
     * @hidden
     */
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

    /**
     * Applies all behaviors from the description objects to the dispatch objects.
     * @param service The dispatch service.
     * @param description The service description.
     * @hidden
     */
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

    /**
     * Applies endpoint behaviors to the dispatch endpoint.
     * @param endpoint The dispatch endpoint.
     * @param description The endpoint description.
     * @hidden
     */
    private _applyEndpointBehaviors(endpoint: DispatchEndpoint, description: EndpointDescription): void {

        description.behaviors.forEach(behavior => behavior.applyEndpointBehavior(description, endpoint));
    }

    /**
     * Applies contract behaviors to the dispatch endpoint.
     * @param endpoint The dispatch endpoint.
     * @param description The contract description.
     * @hidden
     */
    private _applyContractBehaviors(endpoint: DispatchEndpoint, description: ContractDescription): void {

        description.behaviors.forEach(behavior => behavior.applyContractBehavior(description, endpoint));
    }

    /**
     * Applies operation behaviors to the dispatch operation.
     * @param operation The dispatch operation.
     * @param description The operation description.
     * @hidden
     */
    private _applyOperationBehaviors(operation: DispatchOperation, description: OperationDescription): void {

        description.behaviors.forEach(behavior => behavior.applyOperationBehavior(description, operation));
    }
}
