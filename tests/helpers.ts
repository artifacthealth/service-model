import {EndpointDescription} from "../src/description/endpointDescription";
import {OperationDescription} from "../src/description/operationDescription";
import {DispatchOperation} from "../src/dispatcher/dispatchOperation";
import {DispatchEndpoint} from "../src/dispatcher/dispatchEndpoint";
import {DispatcherFactory} from "../src/dispatcherFactory";
import {CalculatorService} from "./fixtures/calculatorService";
import {RpcBehavior} from "../src/behaviors/rpcBehavior";
import {DebugBehavior} from "../src/behaviors/debugBehavior";
import {DispatchService} from "../src/dispatcher/dispatchService";
import {ServiceDescription} from "../src/description/serviceDescription";
import {RequestDispatcher} from "../src/dispatcher/requestDispatcher";
import {RestBehavior} from "../src/behaviors/restBehavior";
import {TodoService} from "./fixtures/todoService";

export function hasOperation(endpoint: EndpointDescription, operation: string): boolean {

    return !!getOperation(endpoint, operation);
}

export function getOperation(endpoint: EndpointDescription, operation: string): OperationDescription {

    for(var i = 0; i < endpoint.contract.operations.length; i++) {
        if(endpoint.contract.operations[i].name == operation) {
            return endpoint.contract.operations[i];
        }
    }
}

export function createOperation(): DispatchOperation {

    return createEndpoint().operations[0];
}

export function createEndpoint(): DispatchEndpoint {

    return createService().endpoints[0];
}

export function createService(): DispatchService {

    return createDispatcher().services[0];
}

export function createDispatcher(): RequestDispatcher {

    var factory = new DispatcherFactory();
    var service = factory.addService(CalculatorService);
    service.addEndpoint("Calculator", "/services/calculator-service/", [new RpcBehavior(), new DebugBehavior()]);

    return factory.createDispatcher();
}

export function createOperationDescription(): OperationDescription {

    return createEndpointDescription().contract.operations[0];
}

export function createEndpointDescription(): EndpointDescription {

    return createServiceDescription().endpoints[0];
}

export function createServiceDescription(): ServiceDescription {

    var factory = new DispatcherFactory();
    var service = factory.addService(CalculatorService);
    service.addEndpoint("Calculator", "/services/calculator-service/", [new RpcBehavior(), new DebugBehavior()]);
    return service;
}

export function createRestOperation(): DispatchOperation {

    return createRestEndpoint().operations[1]; // getTask
}

export function createRestOperationWithBody(): DispatchOperation {

    return createRestEndpoint().operations[4]; // updateTask
}

export function createRestEndpoint(): DispatchEndpoint {

    return createRestService().endpoints[0];
}

export function createRestService(): DispatchService {

    return createRestDispatcher().services[0];
}

export function createRestDispatcher(): RequestDispatcher {

    var factory = new DispatcherFactory();
    var service = factory.addService(TodoService);
    service.addEndpoint("Todo", "/services/todo/", [new RestBehavior(), new DebugBehavior()]);

    return factory.createDispatcher();
}

export function createRestOperationDescription(): OperationDescription {

    return createRestEndpointDescription().contract.operations[1];
}

export function createRestOperationDescriptionWithBody(): OperationDescription {

    return createRestEndpointDescription().contract.operations[4]; // updateTask
}

export function createRestEndpointDescription(): EndpointDescription {

    return createRestServiceDescription().endpoints[0];
}

export function createRestServiceDescription(): ServiceDescription {

    var factory = new DispatcherFactory();
    var service = factory.addService(TodoService);
    service.addEndpoint("Todo", "/services/todo/", [new RestBehavior(), new DebugBehavior()]);
    return service;
}