import {assert} from "chai";
import {createOperationDescription} from "../helpers";
import {RpcMessageFormatter} from "../../src/dispatcher/rpcMessageFormatter";
import {Message} from "../../src/message";

describe('RpcMessageFormatter', () => {

    describe('constructor', () => {

        it('throws an error if operation is not provided', () => {

            assert.throws(() => new RpcMessageFormatter(undefined), "Missing required argument 'operation'.");
        });
    });

    describe('deserializeRequest', () => {

        it('calls callback with error if message body not an object with a property that is the name of the operation', (done) => {

            var message = new Message({});
            createFormatter().deserializeRequest(message, (err, args) => {
                assert.include(err.message, "Missing root element");
                done();
            });
        });

        it('calls callback with error if wrong number of arguments are included in message', (done) => {

            var message = new Message({ add2: [] });
            createFormatter().deserializeRequest(message, (err, args) => {
                assert.include(err.message, "Wrong number of arguments.");
                done();
            });
        });

        it('maps arguments by name to parameters if arguments are passed as object instead of array', (done) => {

            var message = new Message({ add2: { x: 1, y: 2 } });
            createFormatter().deserializeRequest(message, (err, args) => {
                if(err) return done(err);

                assert.deepEqual(args, [1, 2]);
                done();
            });
        });
    });

    function createFormatter(): RpcMessageFormatter {

        var operation = createOperationDescription();
        return new RpcMessageFormatter(operation);
    }
});
