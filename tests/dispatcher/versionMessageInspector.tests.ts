import {assert} from "chai";
import {VersionMessageInspector} from "../../src/dispatcher/versionMessageInspector";
import {Message} from "../../src/message";

describe('VersionMessageInspector', () => {

    describe('afterReceiveRequest', () => {

        it('returns undefined', () => {

            var inspector = new VersionMessageInspector();
            var request = new Message();
            assert.isUndefined(inspector.afterReceiveRequest(request));
        });
    });

    describe('beforeSendReply', () => {

        it('does nothing if reply is not provided', () => {

            var inspector = new VersionMessageInspector();
            inspector.beforeSendReply(undefined, undefined);
        });

        it('adds Vary header to reply', () => {

            var inspector = new VersionMessageInspector();
            var reply = new Message();
            inspector.beforeSendReply(reply, undefined);

            assert.equal(reply.headers.get("Vary"), "Accept-Version");
        });

        it('appends Accept-Version to Vary header if Vary header is already in reply unless vary is *', () => {

            var inspector = new VersionMessageInspector();
            var reply = new Message();

            reply.headers.set("Vary", "Accept-Encoding");
            inspector.beforeSendReply(reply, undefined);
            assert.equal(reply.headers.get("Vary"), "Accept-Encoding, Accept-Version");

            reply.headers.set("Vary", "*");
            inspector.beforeSendReply(reply, undefined);
            assert.equal(reply.headers.get("Vary"), "*");
        });
    });
});
