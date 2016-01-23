import {assert} from "chai";
import {Url} from "../src/url";
import {UrlTemplate} from "../src/urlTemplate";

describe('UrlTemplate', () => {

    describe('match', () => {

        it('returns true when url matches template that includes path parameter', () => {

            var template = new UrlTemplate("/path/:id");
            assert.isTrue(template.match(new Url("/path/1")));
        });

        it('returns false when url does not match template', () => {

            var template = new UrlTemplate("/path/:id");
            assert.isFalse(template.match(new Url("/blah/1")));
        });

        it('returns true when url matches template that includes multiple path parameter', () => {

            var template = new UrlTemplate("/path/:op/:id");
            assert.isTrue(template.match(new Url("/path/get/1")));
        });

        it('ignores trailing and leading slash', () => {

            var template = new UrlTemplate("/path/:id");
            assert.isTrue(template.match(new Url("/path/1")));
            assert.isTrue(template.match(new Url("/path/1/")));
            assert.isTrue(template.match(new Url("path/1/")));
        });

        it('ignore protocol, host, port, query, and hash', () => {

            var template = new UrlTemplate("/path/:id");
            assert.isTrue(template.match(new Url("/path/1")));
            assert.isTrue(template.match(new Url("http://someserver.com/path/1?a=b#somehash")));
        });
    });

    describe('parse', () => {

        it('returns value of parameters if path', () => {

            var template = new UrlTemplate("/path/:id");
            var args = template.parse(new Url("/path/1"));
            assert.equal(args.get("id"), "1");
        });

        it('returns value of query parameters in template', () => {

            var template = new UrlTemplate("/path/:id?x=:px");
            var args = template.parse(new Url("/path/1?x=10&y=11"));
            assert.equal(args.get("id"), "1");
            assert.equal(args.get("px"), "10");
        });

        it('does not return value of query parameters that are not in the template', () => {

            var template = new UrlTemplate("/path/:id?x=:px");
            var args = template.parse(new Url("/path/1?x=10&y=11"));
            assert.isFalse(args.has("y"));
        });
    });
});
