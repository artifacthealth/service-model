import {assert} from "chai";
import {Message} from "../../src/message";
import {BaseAddressMessageFilter} from "../../src/dispatcher/baseAddressMessageFilter";
import {Url} from "../../src/url";

describe('BaseAddressMessageFilter', () => {

    describe('constructor', () => {

        it('throws error if base url is not provided', () => {

            assert.throws(() => new BaseAddressMessageFilter(undefined), "Missing required argument 'url'.");
        });
    });

    describe('match', () => {

        it('returns true if the path in the message url starts with the path specified in the filter', () => {

            var filter = new BaseAddressMessageFilter(new Url("/somepath/next"));

            assert.isTrue(filter.match(createMessage("/somepath/next/path/in/url")));
        });

        it('returns false if the path in the message url does not start with the path specified in the filter', () => {

            var filter = new BaseAddressMessageFilter(new Url("/somepath/next"));

            assert.isFalse(filter.match(createMessage("/someother/path")));
        });
    });

    function createMessage(address: string): Message {

        var message = new Message();
        message.url = new Url(address);
        return message;
    }
});