import {assert} from "chai";
import {createOperationDescription, createEndpoint, RestTodoService, RestTestCastService, HelperEndpointArgs} from "../helpers";
import {RestMessageFormatter} from "../../src/dispatcher/restMessageFormatter";
import {Message} from "../../src/message";
import {Url} from "../../src/url";
import {ServiceWithUnknownParameterType} from "../fixtures/serviceWithUnknownParameterType";
import {RestBehavior} from "../../src/behaviors/restBehavior";
import {ServiceWithMultipleInjectBody} from "../fixtures/serviceWithMultipleInjectBody";
import {HttpStatusCode} from "../../src/httpStatusCode";

describe('RestMessageFormatter', () => {

    describe('constructor', () => {

        it('throws an error if endpoint is not provided', () => {

            assert.throws(() => new RestMessageFormatter(undefined, undefined), "Missing required argument 'endpoint'.");
        });

        it('throws an error if operation is not provided', () => {

            assert.throws(() => new RestMessageFormatter(createEndpoint(RestTodoService), undefined), "Missing required argument 'operation'.");
        });

        it('throws an error if an operation parameter contains an unknown type', () => {

            assert.throws(() => new RestMessageFormatter(createEndpoint(UnknownParameterService), createOperationDescription(UnknownParameterService, "test")), "Parameters on REST enabled operations must be of type");
        });

        it('throws an error if more than one parameter is annoated with @InjectBody', () => {

            assert.throws(() => new RestMessageFormatter(createEndpoint(MultipleInjectBodyService), createOperationDescription(MultipleInjectBodyService, "test")), "Only one operation parameter can be decorated with @InjectBody");
        });
    });

    describe('deserializeRequest', () => {

        it('correctly maps parameters from url', (done) => {

            var message = new Message();
            message.url = new Url("http://somehost.com/services/todo/1");
            createFormatter().deserializeRequest(message, (err, args) => {
                if(err) return done(err);

                assert.deepEqual(args, [1]);
                done();
            });
        });

        it('correctly maps parameters from url', (done) => {

            var message = new Message();
            message.url = new Url("http://somehost.com/services/todo/1");
            createFormatter().deserializeRequest(message, (err, args) => {
                if(err) return done(err);

                assert.deepEqual(args, [1]);
                done();
            });
        });

        it('correctly maps body to annotated parameter', (done) => {

            var message = new Message({ id: 1, text: "Buy eggs", done: false });
            message.url = new Url("http://somehost.com/services/todo/1");
            createFormatterWithBody().deserializeRequest(message, (err, args) => {
                if(err) return done(err);

                assert.deepEqual(args, [1, { id: 1, text: "Buy eggs", done: false }]);
                done();
            });
        });

        it("casts path parameter to number if operation parameter is a number", (done) => {

            var message = new Message();
            message.url = new Url("http://somehost.com/services/cast/number/10");

            createFormatter("testCastNumber", RestTestCastService).deserializeRequest(message, (err, args) => {
                if(err) return done(err);

                assert.lengthOf(args, 1);
                assert.strictEqual(args[0], 10);

                message.url = new Url("http://somehost.com/services/cast/number/10.5");

                createFormatter("testCastNumber", RestTestCastService).deserializeRequest(message, (err, args) => {
                    if(err) return done(err);

                    assert.lengthOf(args, 1);
                    assert.strictEqual(args[0], 10.5);

                    done();
                });
            });
        });

        it("casts path parameter to boolean if operation parameter is a boolean", (done) => {

            var message = new Message();
            message.url = new Url("http://somehost.com/services/cast/boolean/true");

            createFormatter("testCastBoolean", RestTestCastService).deserializeRequest(message, (err, args) => {
                if(err) return done(err);

                assert.lengthOf(args, 1);
                assert.strictEqual(args[0], true);

                message.url = new Url("http://somehost.com/services/cast/boolean/false");

                createFormatter("testCastBoolean", RestTestCastService).deserializeRequest(message, (err, args) => {
                    if(err) return done(err);

                    assert.lengthOf(args, 1);
                    assert.strictEqual(args[0], false);

                    done();
                });
            });
        });

        it("passes through path parameter as string if operation parameter is a string", (done) => {

            var message = new Message();
            message.url = new Url("http://somehost.com/services/cast/string/test");

            createFormatter("testCastString", RestTestCastService).deserializeRequest(message, (err, args) => {
                if(err) return done(err);

                assert.lengthOf(args, 1);
                assert.strictEqual(args[0], "test");

                done();
            });
        });

        it("passes through path parameter as string if operation parameter is a string", (done) => {

            var message = new Message();
            message.url = new Url("http://somehost.com/services/cast/string/test");

            createFormatter("testCastString", RestTestCastService).deserializeRequest(message, (err, args) => {
                if(err) return done(err);

                assert.lengthOf(args, 1);
                assert.strictEqual(args[0], "test");

                done();
            });
        });
    });

    describe('serializeReply', () => {

        it('calls callback with a new message that has a body of the value of the result and a status of 200', (done) => {

            createFormatterWithBody().serializeReply({ someparam: "somevalue" }, (err, reply) => {
                if(err) return done(err);

                assert.equal(reply.statusCode, HttpStatusCode.Ok);
                assert.deepEqual(reply.body, { someparam: "somevalue" });
                done();
            });
        });
    });

    function createFormatterWithBody(): RestMessageFormatter {

        return createFormatter("updateTask");
    }

    function createFormatter(operationName: string = "getTask", args: HelperEndpointArgs = RestTodoService): RestMessageFormatter {

        var operation = createOperationDescription(args, operationName);
        return new RestMessageFormatter(createEndpoint(args), operation);
    }

});

var UnknownParameterService = {

    service: ServiceWithUnknownParameterType,
    contract: "UnknownParameterType",
    path: "/unknown",
    endpointBehaviors: [new RestBehavior()]
}

var MultipleInjectBodyService = {

    service: ServiceWithMultipleInjectBody,
    contract: "MultipleInjectBody",
    path: "/unknown",
    endpointBehaviors: [new RestBehavior()]
}