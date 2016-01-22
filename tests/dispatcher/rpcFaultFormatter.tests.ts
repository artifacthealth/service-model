import {assert} from "chai";
import {RpcFaultFormatter} from "../../src/dispatcher/rpcFaultFormatter";
import {FaultError} from "../../src/faultError";
import {HttpStatusCode} from "../../src/httpStatusCode";

describe('RpcFaultFormatter', () => {

    describe('serializeFault', () => {

        it('sets the status code on the response message to the status code on the fault and formats the message body in the expected format', (done) => {

            var formatter = new RpcFaultFormatter();

            var detail = {
                foo: "bar"
            }
            var text = "Test message";
            var code = "Test";
            var status = HttpStatusCode.BadRequest;

            formatter.serializeFault(new FaultError(detail, text, code, status), (err, message) => {
                if(err) return done(err);

                assert.equal(message.statusCode, status);
                assert.deepEqual(message.body.fault.detail, detail);
                assert.equal(message.body.fault.message, text);
                assert.equal(message.body.fault.code, code);
                done();
            });
        });
    });
});
