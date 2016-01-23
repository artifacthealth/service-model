import {assert} from "chai";
import {Url} from "../src/url";

describe('Url', () => {

    describe('constructor', () => {

        it('does not set any values on object if address is omitted', () => {

            var url = new Url();
            assert.isUndefined(url.protocol);
            assert.isUndefined(url.hostname);
            assert.isUndefined(url.port);
            assert.isUndefined(url.pathname);
            assert.isUndefined(url.query);
            assert.isUndefined(url.hash);
        });

        it('removes any trailing slash from the pathname', () => {

            var url = new Url("/test/");
            assert.equal(url.pathname, "/test");
        });

        it('ensures that there is a leading slash', () => {

            var url = new Url("test");
            assert.equal(url.pathname, "/test");
        });
    });

    describe('clone', () => {

        it('returns a copy of the url', () => {

            var url1 = createUrl();
            var url2 = url1.clone();

            assert.notEqual(url1, url2);
            assert.deepEqual(url1, url2);
        });
    });

    describe('equals', () => {

        it('returns true iff all properties are the same on both Urls', () => {

            var url1 = createUrl();

            assert.isFalse(url1.equals(null));

            assert.isTrue(url1.equals(createUrl()));

            // protocol
            var url2 = createUrl();
            url2.protocol = undefined;
            assert.isFalse(url1.equals(url2));

            // hostname
            var url2 = createUrl();
            url2.hostname = undefined;
            assert.isFalse(url1.equals(url2));

            // port
            var url2 = createUrl();
            url2.port = undefined;
            assert.isFalse(url1.equals(url2));

            // pathname
            var url2 = createUrl();
            url2.pathname = undefined;
            assert.isFalse(url1.equals(url2));

            // query
            var url2 = createUrl();
            url2.query = undefined;
            assert.isFalse(url1.equals(url2));

            // hash
            var url2 = createUrl();
            url2.hash = undefined;
            assert.isFalse(url1.equals(url2));
        });
    });

    describe('normalize', () => {

        it('returns "/" if passed null', () => {

            assert.equal(Url.normalize(null), "/");
        });
    });

    function createUrl(): Url {
        return new Url("http://test:8080/path/to?a=1#hash");
    }
});
