import {assert} from "chai";
import {DispatcherFactory} from "../../src/dispatcherFactory";
import {CalculatorService} from "../fixtures/calculatorService";
import {DebugBehavior} from "../../src/behaviors/debugBehavior";
import {RpcBehavior} from "../../src/behaviors/rpcBehavior";
import {DispatchEndpoint} from "../../src/dispatcher/dispatchEndpoint";
import {RpcFaultFormatter} from "../../src/dispatcher/rpcFaultFormatter";
import {RpcOperationSelector} from "../../src/dispatcher/rpcOperationSelector";
import {Message} from "../../src/message";
import {Url} from "../../src/url";
import {RpcMessageFormatter} from "../../src/dispatcher/rpcMessageFormatter";

describe('DebugBehavior', () => {

    var address = "/services/calculator-service/";

    describe('applyEndpointBehavior', () => {

        it('sets faultFormatter to RpcFaultFormatter on the DispatchEndpoint for the endpoint the behavior is added to', () => {

            assert.instanceOf(createDispatchEndpoint().faultFormatter, RpcFaultFormatter);
        });

        it('sets operationSelector to RpcOperationSelector on the DispatchEndpoint for the endpoint the behavior is added to', () => {

            assert.instanceOf(createDispatchEndpoint().operationSelector, RpcOperationSelector);
        });

        it('sets filter to match the given address on the DispatchEndpoint for the endpoint the behavior is added to', () => {

            var message = new Message();
            message.url = new Url(address);
            assert.isTrue(createDispatchEndpoint().filter.match(message));

            message.url = new Url("some/other/address");
            assert.isFalse(createDispatchEndpoint().filter.match(message));
        });

        it('sets the formatter on all operations within the DispatchEndpoint for the endpoint the behavior is added to', () => {

            var endpoint = createDispatchEndpoint();

            endpoint.operations.forEach(operation => {
                assert.instanceOf(operation.formatter, RpcMessageFormatter);
            });
        });
    });

    function createDispatchEndpoint(): DispatchEndpoint {

        var factory = new DispatcherFactory();
        var service = factory.addService(CalculatorService);

        service.addEndpoint("Calculator", address, [new RpcBehavior()]);

        return factory.createDispatcher().services[0].endpoints[0];
    }
});

/*
 applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void {

 endpoint.faultFormatter = new RpcFaultFormatter();
 endpoint.operationSelector = new RpcOperationSelector(endpoint);
 endpoint.filter = new AddressMessageFilter(endpoint.address).and(endpoint.filter);

 // Note that we assume the operations in the dispatcher line up with the operations in the description. This is
 // true if the dispatcher is created through the DispatcherFactory but could be incorrect otherwise. We'll at
 // least check that the names are the same.
 var operations = description.contract.operations;
 for (var i = 0; i < operations.length; i++) {
 if(endpoint.operations[i].name != operations[i].name) {
 throw new Error("Mismatch between operations in DispatchEndpoint and EndpointDescription");
 }
 endpoint.operations[i].formatter = new RpcMessageFormatter(operations[i]);
 }
 }
 */