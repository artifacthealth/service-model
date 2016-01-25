import {assert} from "chai";
import {createRestOperationDescription, createRestEndpoint} from "../helpers";
import {RestMessageFormatter} from "../../src/dispatcher/restMessageFormatter";
import {Message} from "../../src/message";
import {Url} from "../../src/url";
import {createRestOperationDescriptionWithBody} from "../helpers";

describe('RestMessageFormatter', () => {

    describe('constructor', () => {

        it('throws an error if endpoint is not provided', () => {

            assert.throws(() => new RestMessageFormatter(undefined, undefined), "Missing required argument 'endpoint'.");
        });

        it('throws an error if operation is not provided', () => {

            assert.throws(() => new RestMessageFormatter(createRestEndpoint(), undefined), "Missing required argument 'operation'.");
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
    });

    function createFormatter(): RestMessageFormatter {

        var operation = createRestOperationDescription();
        return new RestMessageFormatter(createRestEndpoint(), operation);
    }

    function createFormatterWithBody(): RestMessageFormatter {

        var operation = createRestOperationDescriptionWithBody();
        return new RestMessageFormatter(createRestEndpoint(), operation);
    }
});
