import {EndpointDescription, EndpointBehavior} from "../src/description/endpointDescription";
import {OperationDescription} from "../src/description/operationDescription";
import {DispatchOperation} from "../src/dispatcher/dispatchOperation";
import {DispatchEndpoint} from "../src/dispatcher/dispatchEndpoint";
import {DispatcherFactory, Constructor} from "../src/dispatcherFactory";
import {CalculatorService} from "./fixtures/calculatorService";
import {RpcBehavior} from "../src/behaviors/rpcBehavior";
import {DebugBehavior} from "../src/behaviors/debugBehavior";
import {DispatchService} from "../src/dispatcher/dispatchService";
import {ServiceDescription} from "../src/description/serviceDescription";
import {RequestDispatcher} from "../src/dispatcher/requestDispatcher";
import {RestBehavior} from "../src/behaviors/restBehavior";
import {TodoService} from "./fixtures/todoService";
import {TestCastService} from "./fixtures/castArgs";

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

export function createOperation(args: HelperEndpointArgs, operationName: string): DispatchOperation {

    var operations = createEndpoint(args).operations;
    for(var i = 0; i < operations.length; i++) {
        if(operations[i].name == operationName) return operations[i];
    }
}

export function createEndpoint(args: HelperEndpointArgs): DispatchEndpoint {

    return createService(args).endpoints[0];
}

export function createService(args: HelperEndpointArgs): DispatchService {

    return createDispatcher(args).services[0];
}

export function createDispatcher(args: HelperEndpointArgs): RequestDispatcher {

    return createDispatcherFactory(args).createDispatcher();
}

export function createOperationDescription(args: HelperEndpointArgs, operationName: string): OperationDescription {

    var operations = createEndpointDescription(args).contract.operations;
    for(var i = 0; i < operations.length; i++) {
        if(operations[i].name == operationName) return operations[i];
    }
}

export function createEndpointDescription(args: HelperEndpointArgs): EndpointDescription {

    return createServiceDescription(args).endpoints[0];
}

export function createServiceDescription(args: HelperEndpointArgs): ServiceDescription {

    return createDispatcherFactory(args).services[0];
}

export function createDispatcherFactory(args: HelperEndpointArgs): DispatcherFactory {

    var factory = new DispatcherFactory();
    var service = factory.addService(args.service);
    service.addEndpoint(args.contract, args.path, args.endpointBehaviors);
    return factory;
}

export interface HelperEndpointArgs {

    service: Constructor<any>;
    contract: string;
    path: string;
    endpointBehaviors: EndpointBehavior[];
}

export var RpcCalculatorService: HelperEndpointArgs = {

    service: CalculatorService,
    contract: "Calculator",
    path: "/services/calculator-service/",
    endpointBehaviors: [new RpcBehavior(), new DebugBehavior()]
}

export var RestTodoService: HelperEndpointArgs = {

    service: TodoService,
    contract: "Todo",
    path: "/services/todo",
    endpointBehaviors: [new RestBehavior(), new DebugBehavior()]
}

export var RestTestCastService: HelperEndpointArgs = {

    service: TestCastService,
    contract: "TestCast",
    path: "/services/cast",
    endpointBehaviors: [new RestBehavior(), new DebugBehavior()]
}
