import {assert} from "chai";
import {DispatcherFactory} from "../../src/dispatcherFactory";
import {CalculatorService} from "../fixtures/calculatorService";
import {DebugBehavior} from "../../src/behaviors/debugBehavior";
import {RpcBehavior} from "../../src/behaviors/rpcBehavior";

describe('DebugBehavior', () => {

    describe('applyEndpointBehavior', () => {

        it('sets includeErrorDetailInFault to true on the DispatchEndpoint for the endpoint the behavior is added to', () => {

            var factory = new DispatcherFactory();
            var service = factory.addService(CalculatorService);

            service.addEndpoint("Calculator", "/services/calculator-service/", [new RpcBehavior(), new DebugBehavior()]);

            var dispatcher = factory.createDispatcher();

            assert.isTrue(dispatcher.services[0].endpoints[0].includeErrorDetailInFault);
        });

    });

    describe('applyServiceBehavior', () => {

        it('sets includeErrorDetailInFault to true for all DispatchEndpoints on the service', () => {

            var factory = new DispatcherFactory();
            var service = factory.addService(CalculatorService);
            service.behaviors.push(new DebugBehavior());

            service.addEndpoint("Calculator", "/services/calculator-service1/", [new RpcBehavior(), new DebugBehavior()]);
            service.addEndpoint("Calculator", "/services/calculator-service2/", [new RpcBehavior(), new DebugBehavior()]);

            var dispatcher = factory.createDispatcher();

            assert.isTrue(dispatcher.services[0].endpoints[0].includeErrorDetailInFault);
            assert.isTrue(dispatcher.services[0].endpoints[1].includeErrorDetailInFault);
        });
    });
});
