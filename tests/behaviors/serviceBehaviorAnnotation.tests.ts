import {assert} from "chai";
import {DispatcherFactory} from "../../src/dispatcherFactory";
import {CalculatorService} from "../fixtures/calculatorService";
import {ServiceBehaviorAnnotation} from "../../src/behaviors/serviceBehaviorAnnotation";
import {RpcBehavior} from "../../src/behaviors/rpcBehavior";

describe('ServiceBehaviorAnnotation', () => {

    describe("constructor", () => {

        it('throws an error if options is not specified', () => {

            assert.throws(() => {
                new ServiceBehaviorAnnotation(undefined);
            }, "Missing required argument 'options'.");
        });
    });


    describe('applyServiceBehavior', () => {

        it('sets name on DispatchService', () => {

            var factory = new DispatcherFactory();
            var service = factory.addService(CalculatorService);
            service.behaviors.push(new ServiceBehaviorAnnotation({ name: "test" }));

            service.addEndpoint("Calculator", "/service", [new RpcBehavior()]);

            var dispatcher = factory.createDispatcher();

            assert.equal(dispatcher.services[0].name, "test");
            assert.isTrue(dispatcher.services[0].operationContextRequired);
        });

        it('sets operationContextRequired on DispatchService', () => {

            var factory = new DispatcherFactory();
            var service = factory.addService(CalculatorService);
            service.behaviors.push(new ServiceBehaviorAnnotation({ operationContext: false }));

            service.addEndpoint("Calculator", "/service", [new RpcBehavior()]);

            var dispatcher = factory.createDispatcher();

            assert.equal(dispatcher.services[0].name, "CalculatorService");
            assert.isFalse(dispatcher.services[0].operationContextRequired);
        });
    });
});
