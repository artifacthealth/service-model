import {assert} from "chai";
import {createOperation, createEndpoint, createService} from "../helpers";
import {DispatchEndpoint} from "../../src/dispatcher/dispatchEndpoint";
import {Url} from "../../src/url";

describe('DispatchEndpoint', () => {

    describe('constructor', () => {

        it('throws an error if service is not provided', () => {

            assert.throws(() => new DispatchEndpoint(undefined, undefined, undefined), "Missing required parameter 'service'.");
        });

        it('throws an error if the address is not provided', () => {

            assert.throws(() => new DispatchEndpoint(createService(), undefined, undefined), "Missing required parameter 'address'.");
        });

        it('throws an error if the contract name is not provided', () => {

            assert.throws(() => new DispatchEndpoint(createService(), new Url("test"), undefined), "Missing required parameter 'contractName'.");
        });
    });

    describe('validate', () => {

        it('throws an error if filter is not defined', () => {

            var endpoint = createEndpoint();
            endpoint.filter = undefined;
            assert.throws(() => endpoint.validate(), "Undefined 'filter'");
        });

        it('throws an error if operationSelector is not defined', () => {

            var endpoint = createEndpoint();
            endpoint.operationSelector = undefined;
            assert.throws(() => endpoint.validate(), "Undefined 'operationSelector'");
        });

        it('throws an error if faultFormatter is not defined', () => {

            var endpoint = createEndpoint();
            endpoint.faultFormatter = undefined;
            assert.throws(() => endpoint.validate(), "Undefined 'faultFormatter'");
        });
    });
});
