import {assert} from "chai";
import {DefaultOperationInvoker} from "../../src/dispatcher/defaultOperationInvoker";
import {OperationDescription} from "../../src/description/operationDescription";
import {CalculatorService} from "../fixtures/calculatorService";
import {getOperation} from "../helpers";
import {getType} from "reflect-helper";
import {ServiceDescription} from "../../src/description/serviceDescription";

describe('DefaultOperationInvoker', () => {

    describe('constructor', () => {

        it('throws error if operation description is not provided', () => {

            assert.throws(() => new DefaultOperationInvoker(undefined), "Missing required argument 'operationDescription'.");
        });
    });

    describe('invoke', () => {

        it('throws error if instance is not supplied', () => {

            var invoker = createInvoker();
            assert.throws(() => invoker.invoke(undefined, undefined, undefined), "Missing required argument 'instance'.");
        });

        it('throws error if arguments are not supplied', () => {

            var invoker = createInvoker();
            assert.throws(() => invoker.invoke(new CalculatorService(), undefined, undefined), "Missing required argument 'args'.");
        });

        it('calls callback with error if wrong number of arguments are supplied', (done) => {

            var invoker = createInvoker();
            invoker.invoke(new CalculatorService(), [], (err) => {
                assert.ok(err);
                assert.include(err.message, "Wrong number of arguments for operation.");
                done();
            });
        });

        it('calls callback with error if timeout is exceeded', (done) => {

            var invoker = createInvoker();
            invoker.timeout = 10;
            invoker.invoke(new CalculatorService(), [1, 2], (err) => {
                assert.ok(err);
                assert.include(err.message, "Timeout of 10ms exceeded");
                done();
            });
        });

        it('does not call callback a second time if callback resolves after timeout', (done) => {

            var called = 0;
            var invoker = createInvoker();
            invoker.timeout = 10;
            invoker.invoke(new CalculatorService(), [1, 2], () => called++);

            // callback on slowAdd resolves after 50ms so give it 100 and then check to make sure callback only called once
            setTimeout(() => {
                assert.equal(called, 1);
                done();
            }, 100)
        });

        it('does not return callback error if operation finishes before timeout', (done) => {

            var invoker = createInvoker();
            invoker.invoke(new CalculatorService(), [1, 2], (err, result) => {
                assert.isNull(err);
                assert.equal(result, 3);
                done();
            });
        });

        it('throws error if operation calls callback multiple times', (done) => {

            var invoker = createInvoker("multipleCallsToCallback");
            assert.throws(() => {
                invoker.invoke(new CalculatorService(), [1, 2], done);
            }, "Callback already called.");
        });
    });

    function createInvoker(operationName = "slowAdd"): DefaultOperationInvoker {

        var service = new ServiceDescription(getType(CalculatorService));
        var operation = getOperation(service.addEndpoint("Calculator", "someaddress"), operationName);

        return new DefaultOperationInvoker(operation);
    }
});
