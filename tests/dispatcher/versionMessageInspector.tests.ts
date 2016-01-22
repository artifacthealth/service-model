import {assert} from "chai";
import {VersionMessageInspector} from "../../src/dispatcher/versionMessageInspector";
import {Message} from "../../src/message";

describe('VersionMessageInspector', () => {

    describe('beforeSendReply', () => {

        it('adds Vary header to reply', () => {

            var inspector = new VersionMessageInspector();
            var reply = new Message();
            inspector.beforeSendReply(reply, undefined);

            assert.equal(reply.headers.get("Vary"), "Accept-Version");
        });

        it('appends Accept-Version to Vary header if Vary header is already in reply', () => {

            var inspector = new VersionMessageInspector();
            var reply = new Message();
            reply.headers.set("Vary", "Accept-Encoding");
            inspector.beforeSendReply(reply, undefined);

            assert.equal(reply.headers.get("Vary"), "Accept-Encoding, Accept-Version");
        });
    });
});
