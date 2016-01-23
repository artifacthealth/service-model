import {assert} from "chai";
import {Message} from "../../src/message";
import {VersionMessageFilter} from "../../src/dispatcher/versionMessageFilter";

describe('VersionMessageFilter', () => {

    describe('constructor', () => {

        it('throws an error if version is not provided', () => {

            assert.throws(() => new VersionMessageFilter(undefined), "Missing required argument 'version'.");
        });
    });

    describe('match', () => {

        it('returns true if the version specification in the Accept-Version header is satisfied by the filter version', () => {

            var filter = new VersionMessageFilter("1.5.0");

            var message = new Message();

            message.headers.set("Accept-Version", "2.0.0");
            assert.isFalse(filter.match(message));

            message.headers.set("Accept-Version", "^1.0.0");
            assert.isTrue(filter.match(message));
        });

        it('returns true if the message does not contain an Accept-Version header', () => {

            var filter = new VersionMessageFilter("1.5.0");
            var message = new Message();
            assert.isTrue(filter.match(message));
        });
    });
});
