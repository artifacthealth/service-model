import {assert} from "chai";
import {createOperation, createEndpoint, RpcCalculatorService} from "../helpers";
import {DispatchOperation} from "../../src/dispatcher/dispatchOperation";

describe('DispatchOperation', () => {

    describe('constructor', () => {

        it('throws an error if endpoint is not provided', () => {

            assert.throws(() => new DispatchOperation(undefined, undefined), "Missing required parameter 'endpoint'.");
        });

        it('throws an error if the operation name is not provided', () => {

            assert.throws(() => new DispatchOperation(createEndpoint(RpcCalculatorService), undefined), "Missing required parameter 'name'.");
        });
    });

    describe('validate', () => {

        it('throws an error if formatter is not defined', () => {

            var operation = createOperation(RpcCalculatorService, "add2");
            operation.formatter = undefined;
            assert.throws(() => operation.validate(), "Undefined 'formatter'");
        });

        it('throws an error if invoker is not defined', () => {

            var operation = createOperation(RpcCalculatorService, "add2");
            operation.invoker = undefined;
            assert.throws(() => operation.validate(), "Undefined 'invoker'");
        });
    });
});
