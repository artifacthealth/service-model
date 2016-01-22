import {assert} from "chai";
import {RequestDispatcher} from "../../src/dispatcher/requestDispatcher";
import {DispatcherFactory} from "../../src/dispatcherFactory";
import {CalculatorService} from "../fixtures/calculatorService";
import {RpcBehavior} from "../../src/behaviors/rpcBehavior";
import {DummyRequestContext} from "../dummRequestContext";
import {Message} from "../../src/message";
import {Url} from "../../src/url";
import {HttpStatusCode} from "../../src/httpStatusCode";
import {DebugBehavior} from "../../src/behaviors/debugBehavior";

describe('RequestDispatcher', () => {

    var address = "/services/calculator-service/";

    describe('dispatch', () => {

        it('replies with NotFound error if endpoint is not found', (done) => {

            var dispatcher = createDispatcher();
            var message = new Message();
            message.url = new Url("foo");

            dispatcher.dispatch(new DummyRequestContext(message, (err, response) => {
                if(err) return done(err);

                assert.equal(response.statusCode, HttpStatusCode.NotFound);
                done();
            }));
        });

        it('replies with ServiceUnavailable error if dispatcher is closed is not found', (done) => {

            var dispatcher = createDispatcher();
            var message = new Message();
            message.url = new Url(address);

            dispatcher.close();
            dispatcher.dispatch(new DummyRequestContext(message, (err, response) => {
                if(err) return done(err);

                assert.equal(response.statusCode, HttpStatusCode.ServiceUnavailable);
                done();
            }));
        });

        it('dispatches request if endpoint is found and dispatcher is not closed', (done) => {

            var dispatcher = createDispatcher();
            var message = new Message({ add2: [1, 2] });
            message.url = new Url(address);

            dispatcher.dispatch(new DummyRequestContext(message, (err, response) => {
                if(err) return done(err);

                assert.equal(response.statusCode, HttpStatusCode.Ok);
                assert.deepEqual(response.body, { response: 3 });
                done();
            }));
        });
    });

    describe('close', () => {

        it('calls callback immediately if dispatcher is already closed', (done) => {

            var dispatcher = createDispatcher();
            dispatcher.close((err) => {
                if(err) return done(err);
                dispatcher.close(done);
            });
        });

        it('calls all callbacks if close called multiple times', (done) => {
            var called = 0;

            var dispatcher = createDispatcher();

            var message = new Message({ slowAdd: [1, 2] });
            message.url = new Url(address);

            dispatcher.dispatch(new DummyRequestContext(message));

            dispatcher.close(handleCallback);
            dispatcher.close(handleCallback);

            function handleCallback(err: Error) {
                if (err) return done(err);
                called++;
                if (called == 2) done();
            }
        });

        it('aborts any requests that have not returned within closeTimeout', (done) => {
            var dispatcher = createDispatcher();
            dispatcher.closeTimeout = 10;

            var message = new Message({ slowAdd: [1, 2] });
            message.url = new Url(address);

            dispatcher.dispatch(new DummyRequestContext(message, (err, response) => {
                console.log(response)
                assert.ok(err);
                assert.include(err.message, "Aborted");
                done();
            }));
            dispatcher.close();
        });
    });

    function createDispatcher(): RequestDispatcher {

        var factory = new DispatcherFactory();
        var service = factory.addService(CalculatorService);
        service.addEndpoint("Calculator", address, [new RpcBehavior(), new DebugBehavior()]);

        return factory.createDispatcher();
    }
});
