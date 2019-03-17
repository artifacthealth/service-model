import {assert} from "chai";
import {RequestHandler} from "../../src/dispatcher/requestHandler";
import {DispatcherFactory} from "../../src/dispatcherFactory";
import {CalculatorService} from "../fixtures/calculatorService";
import {RpcBehavior} from "../../src/behaviors/rpcBehavior";
import {DebugBehavior} from "../../src/behaviors/debugBehavior";
import {Message} from "../../src/message";
import {Url} from "../../src/url";
import {DummyRequestContext} from "../dummyRequestContext";
import {ResultCallback} from "../../src/common/callbackUtil";
import {HttpStatusCode} from "../../src/httpStatusCode";
import {ErrorHandler} from "../../src/dispatcher/dispatchEndpoint";
import {RequestContext} from "../../src/operationContext";
import {EndpointBehavior} from "../../src/description/endpointDescription";

describe('RequestHandler', () => {

    var address = "/services/calculator-service/";

    describe('process', () => {

        it('throws error if callback is not provided', () => {

            var handler = createHandler();
            assert.throws(() => {
                handler.process(undefined);
            }, "Missing required argument 'callback'.");
        });

        it('throws error if called multiple times', () => {

            var handler = createHandler();
            assert.throws(() => {
                handler.process(() => {});
                handler.process(() => {});
            }, "Process called multiple times.");
        });

        it('replies with NotFound status if unable to choose operation', (done) => {

            var handler = createHandler({ foo: [] }, (err, response) => {
                if(err) return done(err);

                assert.equal(response.statusCode, HttpStatusCode.NotFound);
                done();
            });

            handler.process(() => {});
        });

        it('replies with InternalError if operation implementation passes error to callback', (done) => {

            var handler = createHandler({ makeError: [] }, (err, response) => {
                if(err) return done(err);

                assert.equal(response.statusCode, HttpStatusCode.InternalServerError);
                done();
            });

            handler.process(() => {});
        });

        it('immediately replies with status of Ok if operation is one way', (done) => {

            var handler = createHandler({ notify: [1, 2] }, (err, response) => {
                if(err) return done(err);

                assert.equal(response.statusCode, HttpStatusCode.Ok);
                done();
            });

            handler.process(() => {});
        });

        it('replies with error if unable to deserialize request', (done) => {

            // pass wrong number of arguments
            var handler = createHandler({ notify: [] }, (err, response) => {
                if(err) return done(err);

                assert.notEqual(response.statusCode, HttpStatusCode.Ok);
                done();
            });

            handler.process(() => {});
        });

        it('catches any errors thrown in operation implementation and emits them on the request dispatcher', (done) => {

            var factory = new DispatcherFactory();
            var service = factory.addService(CalculatorService);
            service.addEndpoint("Calculator", address, [new RpcBehavior(), new DebugBehavior()]);

            var message = new Message({ throwError: [] });
            message.url = new Url(address);

            var dispatcher = factory.createDispatcher();
            dispatcher.on('error', (err: Error) => {
                assert.ok(err);
                assert.include(err.message, "Some error");
                done();
            });

            var handler = new RequestHandler(dispatcher.services[0].endpoints[0], new DummyRequestContext(message));
            handler.process(() => {});
        });

        it('gives any ErrorHandlers on the DispatchEndpoint a chance to handle the error before sending a fault', (done) => {

            var factory = new DispatcherFactory();
            var service = factory.addService(CalculatorService);
            service.addEndpoint("Calculator", address, [new RpcBehavior(), new DebugBehavior()]);

            var message = new Message({ makeError: [] });
            message.url = new Url(address);

            var dispatcher = factory.createDispatcher();
            var endpoint = dispatcher.services[0].endpoints[0];

            var errorHandler = new DummyErrorHandler();
            endpoint.errorHandlers.push(errorHandler);

            var handler = new RequestHandler(endpoint, new DummyRequestContext(message));
            handler.process(() => {
                assert.equal(errorHandler.called, 1);
                done();
            });
        });

        it('does not provide error details if includeErrorDetailInFault is not enabled on endpoint', (done) => {

            var handler = createHandler({ makeError: [] }, (err, response) => {
                if(err) return done(err);

                assert.equal(response.statusCode, HttpStatusCode.InternalServerError);
                assert.isUndefined(response.body.fault.detail);

                done();
            }, false);

            handler.process(() => {});
        });

        it('aborts request if error is thrown in error handler', (done) => {

            var factory = new DispatcherFactory();
            var service = factory.addService(CalculatorService);
            service.addEndpoint("Calculator", address, [new RpcBehavior(), new DebugBehavior()]);

            var message = new Message({ makeError: [] });
            message.url = new Url(address);

            var dispatcher = factory.createDispatcher();
            dispatcher.on('error', (err: Error) => {
                // squelch errors
            });
            var endpoint = dispatcher.services[0].endpoints[0];

            endpoint.errorHandlers.push(new ThrowErrorInErrorHandler());

            var handler = new RequestHandler(endpoint, new DummyRequestContext(message, (err, response) => {
                assert.include(err.message, "Aborted");
                done();
            }));
            handler.process(() => {});
        });

        it('merges in headers from OperationContext', (done) => {

            var factory = new DispatcherFactory();
            var service = factory.addService(CalculatorService);
            service.addEndpoint("Calculator", address, [new RpcBehavior(), new DebugBehavior()]);

            var message = new Message({ customHeaders: [] });
            message.url = new Url(address);

            var dispatcher = factory.createDispatcher();
            var handler = new RequestHandler(dispatcher.services[0].endpoints[0], new DummyRequestContext(message, (err, response) => {

                assert.deepEqual(response.headers.toObject(), {
                   "customheader": "somevalue"
                });
                done();
            }));
            handler.process(() => {});
        });
    });

    function createHandler(body: any = { add2: [1, 2] }, callback?: ResultCallback<Message>, debug = true): RequestHandler {

        var factory = new DispatcherFactory();
        var service = factory.addService(CalculatorService);
        var behaviors: EndpointBehavior[] = [new RpcBehavior()];
        if(debug) {
            behaviors.push(new DebugBehavior());
        }
        service.addEndpoint("Calculator", address, behaviors);

        var message = new Message(body);
        message.url = new Url(address);

        var dispatcher = factory.createDispatcher();

        return new RequestHandler(dispatcher.services[0].endpoints[0], new DummyRequestContext(message, callback));
    }

    class DummyErrorHandler implements ErrorHandler {

        called = 0;

        handleError(err: Error, request: RequestContext, next: Callback): void {

            this.called++;
            next(err);
        }
    }

    class ThrowErrorInErrorHandler implements ErrorHandler {


        handleError(err: Error, request: RequestContext, next: Callback): void {

            throw new Error("Error in error handler");
        }
    }
});
