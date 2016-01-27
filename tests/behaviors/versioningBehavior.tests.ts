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
import {VersioningBehavior} from "../../src/behaviors/versioningBehavior";
import {VersionMessageInspector} from "../../src/dispatcher/versionMessageInspector";

describe('VersioningBehavior', () => {

    var address = "/services/calculator-service/";

    describe("constructor", () => {

        it('throws an error if args is not specified', () => {

            assert.throws(() => {
                new VersioningBehavior(undefined);
            }, "Missing required argument 'options'.");
        });

        it('throws an error if args.version is not specified', () => {
            assert.throws(() => {
                new VersioningBehavior({ version: undefined });
            }, "Missing required argument 'options.version'.")
        });
    });

    describe('applyContractBehavior', () => {

        it('sets filter to match the specified version on the DispatchEndpoint for any endpoint that handles the contract', () => {

            checkFilter(createDispatchEndpointWithContractBehavior({ version: "1.0.0" }));
        });

        it('adds the VersionMessageInspector to the messageInspectors on the DispatchEndpoint for any endpoint that handles the contract', () => {

            checkMessageInspector(createDispatchEndpointWithContractBehavior({ version: "1.0.0" }));
        });
    });

    describe('applyEndpointBehavior', () => {

        it('sets filter to match the specified version on the DispatchEndpoint for the endpoint', () => {

            checkFilter(createDispatchEndpoint({ version: "1.0.0" }));
        });

        it('adds the VersionMessageInspector to the messageInspectors on the DispatchEndpoint for the endpoint', () => {

            checkMessageInspector(createDispatchEndpoint({ version: "1.0.0" }));
        });
    });

    function checkFilter(endpoint: DispatchEndpoint): void {

        var message = new Message();
        message.url = new Url(address);
        message.headers.set("Accept-Version", "^1.0.0");
        assert.isTrue(endpoint.filter.match(message));

        message.headers.set("Accept-Version", "^2.0.0");
        assert.isFalse(endpoint.filter.match(message));
    }

    function checkMessageInspector(endpoint: DispatchEndpoint): void {

        assert.instanceOf(endpoint.messageInspectors[0], VersionMessageInspector);
    }

    function createDispatchEndpoint(args: { version: string, contract?: string }): DispatchEndpoint {

        var factory = new DispatcherFactory();
        var service = factory.addService(CalculatorService);

        service.addEndpoint("Calculator", address, [new RpcBehavior(), new VersioningBehavior(args)]);

        return factory.createDispatcher().services[0].endpoints[0];
    }

    function createDispatchEndpointWithContractBehavior(args: { version: string, contract?: string }): DispatchEndpoint {

        var factory = new DispatcherFactory();
        var service = factory.addService(CalculatorService);

        var endpoint = service.addEndpoint("Calculator", address, [new RpcBehavior()]);
        endpoint.contract.behaviors.push(new VersioningBehavior(args));

        return factory.createDispatcher().services[0].endpoints[0];
    }
});
