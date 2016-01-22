import {assert} from "chai";
import {onlyOnce} from "../../src/common/callbackUtil";
import {ServiceDescription} from "../../src/description/serviceDescription";
import {ServiceWithDebugBehavior} from "../fixtures/serviceWithDebugBehavior";
import {getType} from "reflect-helper";
import {DebugBehavior} from "../../src/behaviors/debugBehavior";
import {RpcBehavior} from "../../src/behaviors/rpcBehavior";
import {ServiceWithDuplicateContracts} from "../fixtures/serviceWithDuplicateContracts";
import {ServiceWithContractBehavior} from "../fixtures/serviceWithContractBehavior";
import {VersioningBehavior} from "../../src/behaviors/versioningBehavior";
import {ServiceWithMissingTargetContract} from "../fixtures/serviceWithMissingTargetContract";
import {ServiceWithBadTargetContract} from "../fixtures/serviceWithBadTargetContract";
import {ServiceWithMissingOperationTarget} from "../fixtures/serviceWithMissingOperationTarget";
import {ServiceWithMultipleContracts} from "../fixtures/serviceWithMultipleContracts";
import {DispatchEndpoint} from "../../src/dispatcher/dispatchEndpoint";
import {EndpointDescription} from "../../src/description/endpointDescription";
import {CalculatorService} from "../fixtures/calculatorService";
import {OperationDescription} from "../../src/description/operationDescription";
import {ServiceWithMissingCallback} from "../fixtures/serviceWithMissingCallback";
import {getOperation, hasOperation} from "../helpers";

describe('ServiceDescription', () => {

    describe('constructor', () => {

        it('throws an error if the service type is not specified', () => {

            assert.throw(() => new ServiceDescription(undefined), "Missing required argument 'serviceType'.");
        });

        it('adds any ServiceBehaviors added as annotations on the service type', () => {

            var service = new ServiceDescription(getType(ServiceWithDebugBehavior));
            assert.instanceOf(service.behaviors[0], DebugBehavior);
        });
    });

    describe('addEndpoint', () => {

        it('throws an error if the contract name is not specified', () => {

            var service = new ServiceDescription(getType(ServiceWithDebugBehavior));
            assert.throw(() => service.addEndpoint(undefined, undefined), "Missing required argument 'contractName'.");
        });

        it('throws an error if the address is not specified', () => {

            var service = new ServiceDescription(getType(ServiceWithDebugBehavior));
            assert.throw(() => service.addEndpoint("Calculator", undefined), "Missing required argument 'address'.");
        });

        it('throws an error if the contract is not found on the service', () => {

            var service = new ServiceDescription(getType(ServiceWithDebugBehavior));
            assert.throw(() => service.addEndpoint("blah", "foo"), "Contract 'blah' not found on service 'ServiceWithDebugBehavior'");
        });

        it('creates the endpoint, adds it to the service, and returns the endpoint', () => {

            var service = new ServiceDescription(getType(ServiceWithDebugBehavior));
            var endpoint = service.addEndpoint("Calculator", "someaddress");

            assert.ok(endpoint, "Endpoint not returned");
            assert.equal(service.endpoints[0], endpoint);
        });

        it('adds any specified behaviors to the endpoint', () => {

            var service = new ServiceDescription(getType(ServiceWithDebugBehavior));
            var behavior = new RpcBehavior();
            var endpoint = service.addEndpoint("Calculator", "someaddress", behavior);
            assert.equal(endpoint.behaviors[0], behavior);
        });

        it('adds any contract behaviors specified as decorators on the service', () => {

            var service = new ServiceDescription(getType(ServiceWithContractBehavior));
            var endpoint = service.addEndpoint("Calculator", "someaddress");
            assert.instanceOf(service.endpoints[0].contract.behaviors[0], VersioningBehavior);
        });

        it('throws an error is service has duplicate contract names', () => {

            var service = new ServiceDescription(getType(ServiceWithDuplicateContracts));
            assert.throw(() => service.addEndpoint("Calculator", "someaddress"), "Duplicate contract with name 'Calculator'");
        });

        it('throws an error if the service has multiple contracts and the target contract is not specified on a contract behavior decorator', () => {

            var service = new ServiceDescription(getType(ServiceWithMissingTargetContract));
            assert.throw(() => service.addEndpoint("Calculator", "someaddress"), "Target contract must be specified on contract behavior attribute when service has multiple contracts.");
        });

        it('throws an error target contract specified on decorator is unknown', () => {

            var service = new ServiceDescription(getType(ServiceWithBadTargetContract));
            assert.throw(() => service.addEndpoint("Calculator", "someaddress"), "Could not find target contract 'Foo'");
        });

        it('throws an error service has multiple contracts and the operation does not specify the target contract', () => {

            var service = new ServiceDescription(getType(ServiceWithMissingOperationTarget));
            assert.throw(() => service.addEndpoint("Calculator1", "someaddress"), "Target contract must be specified on operation attribute when service has multiple contracts.");
        });

        it('adds operations to the target contract specified in the operation decorator when the service has multiple contracts', () => {

            var service = new ServiceDescription(getType(ServiceWithMultipleContracts));
            var endpoint1 = service.addEndpoint("Calculator1", "someaddress");
            var endpoint2 = service.addEndpoint("Calculator2", "someaddress");

            assertEndpointHasOperation(endpoint1, "add2");
            assertEndpointDoesNotHaveOperation(endpoint1, "subtract");
            assertEndpointDoesNotHaveOperation(endpoint1, "divide");
            assertEndpointHasOperation(endpoint2, "subtract");
            assertEndpointHasOperation(endpoint2, "divide");
            assertEndpointDoesNotHaveOperation(endpoint2, "add2");
        });

        it('only adds operations to contract that are not decorated with Operation decorator', () => {

            var service = new ServiceDescription(getType(CalculatorService));
            var endpoint = service.addEndpoint("Calculator", "someaddress");

            assertEndpointHasOperation(endpoint, "add2");
            assertEndpointHasOperation(endpoint, "subtract");
            assertEndpointHasOperation(endpoint, "divide");
            assertEndpointDoesNotHaveOperation(endpoint, "mod");
        });

        it('sets timeout on operation if specified in decorator', () => {

            var service = new ServiceDescription(getType(CalculatorService));
            var operation = getOperation(service.addEndpoint("Calculator", "someaddress"), "divide");

            assert.equal(operation.timeout, 10);
        });

        it('sets oneWay on operation if specified in decorator', () => {

            var service = new ServiceDescription(getType(CalculatorService));
            var operation = getOperation(service.addEndpoint("Calculator", "someaddress"), "notify");

            assert.isTrue(operation.isOneWay);
        });

        it('throws an error operation is missing a callback', () => {

            var service = new ServiceDescription(getType(ServiceWithMissingCallback));
            assert.throw(() => service.addEndpoint("Calculator", "someaddress"), "Final parameter on operation must be a callback function");
        });

        function assertEndpointHasOperation(endpoint: EndpointDescription, operation: string): void {

            assert.isTrue(hasOperation(endpoint, operation), "Endpoint '" + endpoint.contract.name + "' does not have operation '" + operation + "'.");
        }

        function assertEndpointDoesNotHaveOperation(endpoint: EndpointDescription, operation: string): void {

            assert.isFalse(hasOperation(endpoint, operation), "Endpoint '" + endpoint.contract.name + "' has unexpected operation '" + operation + "'.");
        }
    });
});
