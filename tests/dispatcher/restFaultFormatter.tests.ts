import {assert} from "chai";
import {RestFaultFormatter} from "../../src/dispatcher/restFaultFormatter";
import {FaultError} from "../../src/faultError";
import {HttpStatusCode} from "../../src/httpStatusCode";

describe('RestFaultFormatter', () => {

    describe('serializeFault', () => {

        it('sets the status code on the response message to the status code on the fault and formats the message body in the expected format', (done) => {

            var formatter = new RestFaultFormatter();

            var detail = {
                foo: "bar"
            }
            var text = "Test message";
            var code = "Test";
            var status = HttpStatusCode.BadRequest;

            formatter.serializeFault(new FaultError(detail, text, code, status), (err, message) => {
                if(err) return done(err);

                assert.equal(message.statusCode, status);
                assert.deepEqual(message.body.detail, detail);
                assert.equal(message.body.message, text);
                assert.equal(message.body.code, code);
                done();
            });
        });
    });
});
