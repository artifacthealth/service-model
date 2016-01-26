import {assert} from "chai";
import {createService, createDispatcher, RpcCalculatorService} from "../helpers";
import {Url} from "../../src/url";
import {DispatchService} from "../../src/dispatcher/dispatchService";

describe('DispatchService', () => {

    describe('constructor', () => {

        it('throws an error if dispatcher is not provided', () => {

            assert.throws(() => new DispatchService(undefined, undefined), "Missing required parameter 'dispatcher'.");
        });

        it('throws an error if name is not provided', () => {

            assert.throws(() => new DispatchService(createDispatcher(RpcCalculatorService), undefined), "Missing required parameter 'name'.");
        });
    });

    describe('validate', () => {

        it('throws an error if instanceProvider is not defined', () => {

            var service = createService(RpcCalculatorService);
            service.instanceProvider = undefined;
            assert.throws(() => service.validate(), "Undefined 'instanceProvider'");
        });

        it('validates endpoints in the service', () => {

            var service = createService(RpcCalculatorService);
            service.endpoints[0].operationSelector = undefined;
            assert.throws(() => service.validate(), "Undefined 'operationSelector'");
        });
    });
});
