import {assert} from "chai";
import {Message} from "../../src/message";
import {VersionMessageFilter} from "../../src/dispatcher/versionMessageFilter";
import {AddressMessageFilter} from "../../src/dispatcher/addressMessageFilter";
import {Url} from "../../src/url";

describe('MessageFilter', () => {

    describe('or', () => {

        it('returns a new filter which matches if either of the filters passed as arguments match', () => {

            var filter = new AddressMessageFilter(new Url("one")).or(new AddressMessageFilter(new Url("two")));

            assert.isTrue(filter.match(createMessage("one")));
            assert.isTrue(filter.match(createMessage("two")));
            assert.isFalse(filter.match(createMessage("foo")));
        });
    });

    describe('and', () => {

        it('returns a new filter which matches if both of the filters passed as arguments match', () => {

            var filter = new AddressMessageFilter(new Url("one")).and(new VersionMessageFilter("1.5.0"));

            assert.isTrue(filter.match(createMessage("one", "1.5.0")));
            assert.isFalse(filter.match(createMessage("two", "1.5.0")));
            assert.isFalse(filter.match(createMessage("one", "2.0.0")));
        });
    });

    describe('not', () => {

        it('returns a new filter which matches if the filter passed as an argument does not match', () => {

            var filter = new AddressMessageFilter(new Url("one")).not();

            assert.isTrue(filter.match(createMessage("two")));
            assert.isFalse(filter.match(createMessage("one")));
        });
    });

    function createMessage(address: string, version?: string): Message {

        var message = new Message();
        message.url = new Url(address);
        if(version) {
            message.headers.set("Accept-Version", version);
        }
        return message;
    }
});
