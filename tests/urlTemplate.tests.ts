import {assert} from "chai";
import {Url} from "../src/url";
import {UrlTemplate} from "../src/urlTemplate";

describe('UrlTemplate', () => {

    describe('constructor', () => {

        it('throws if hash is specified in the template', () => {

            assert.throws(() => new UrlTemplate("test#test"), "Hash not supported in template.");
        });

        it('throws if parameters in path are not separated by a literal', () => {

            assert.throws(() => new UrlTemplate("{a}{b}"), "Invalid path. Parameters must be separated by a literal");
        });

        it('throws if there is a duplicate parameter in the path', () => {

            assert.throws(() => new UrlTemplate("{a}/{a}"), "Invalid path. Duplicate parameter 'a'");
        });

        it('throws if there is an unmatched {', () => {

            assert.throws(() => new UrlTemplate("{a}/{"), "Invalid path. Unmatched '{'.");
        });

        it('throws if query is missing a value', () => {

            assert.throws(() => new UrlTemplate("/?a"), "Invalid query 'a': Missing value.");
        });

        it('throws if query parameter name is duplicate of parameter name in path', () => {

            assert.throws(() => new UrlTemplate("{a}/?v={a}"), "Invalid query 'v': Duplicate parameter name 'a'.");
        });

        it('throws if query parameter name is duplicate of another query parameter name', () => {

            assert.throws(() => new UrlTemplate("/?v={a}&s={a}"), "Invalid query 's': Duplicate parameter name 'a'.");
        });

        it('throws if query value is not a parameter name', () => {

            assert.throws(() => new UrlTemplate("/?v=a"), "Invalid query 'v': Value must be a parameter name in the format '{name}'.");
        });
    });

    describe('match', () => {

        it('returns true when url matches template that includes path parameter', () => {

            var template = new UrlTemplate("/path/{id}");
            assert.isTrue(template.match(new Url("/path/1")));
        });

        it('returns false when url does not match template', () => {

            var template = new UrlTemplate("/path/{id}");
            assert.isFalse(template.match(new Url("/blah/1")));
        });

        it('returns true when url matches template that includes multiple path parameter', () => {

            var template = new UrlTemplate("/path/{op}/{id}");
            assert.isTrue(template.match(new Url("/path/get/1")));
        });

        it('ignores trailing and leading slash', () => {

            var template = new UrlTemplate("/path/{id}");
            assert.isTrue(template.match(new Url("/path/1")));
            assert.isTrue(template.match(new Url("/path/1/")));
            assert.isTrue(template.match(new Url("/path/1/")));
        });

        it('ignores protocol, host, port, query, and hash', () => {

            var template = new UrlTemplate("/path/{id}");
            assert.isTrue(template.match(new Url("https://someotherserver.com:8080/path/1?a=1")));
        });

        it('should not match if url has more segments than expected', () => {

            var template = new UrlTemplate("/{id}");
            assert.isFalse(template.match(new Url("/path/get/1")));
        });

        it('matches empty templates', () => {

            var template1 = new UrlTemplate("");
            assert.isTrue(template1.match(new Url("/")));
            assert.isTrue(template1.match(new Url("")));

            var template2 = new UrlTemplate("/");
            assert.isTrue(template2.match(new Url("/")));
            assert.isTrue(template2.match(new Url("")));
        });
    });

    describe('parses', () => {

        it('ignores protocol, host, port, query, and hash', () => {

            var template = new UrlTemplate("/path/{id}");
            var args = template.parse(new Url("https://someotherserver.com:8080/path/1?a=1"));
            assert.equal(args.get("id"), "1");
        });

        it('returns value of parameters in template path', () => {

            var template = new UrlTemplate("/path/{id}");
            var args = template.parse(new Url("/path/1"));
            assert.equal(args.get("id"), "1");
        });

        it('returns value of query parameters in template', () => {

            var template = new UrlTemplate("/path/{id}?x={px}");
            var args = template.parse(new Url("/path/1?x=10&y=11"));
            assert.equal(args.get("id"), "1");
            assert.equal(args.get("px"), "10");
        });

        it('does not return value of query parameters that are not in the template', () => {

            var template = new UrlTemplate("/path/{id}?x={px}");
            var args = template.parse(new Url("/path/1?x=10&y=11"));
            assert.isFalse(args.has("y"));
        });
    });

    describe("prefix", () => {

        it('prepends an address prefix to the pattern', () => {

            var template = new UrlTemplate("/path/{id}");
            template = template.prefix(new Url("/something"));
            assert.isTrue(template.match(new Url("https://someotherserver.com:8080/something/path/1?a=1")));
        });

        it("ensures that pattern remains normalized (no training slash)", () => {

            var template = new UrlTemplate("");
            template = template.prefix(new Url("/something"));
            assert.isTrue(template.match(new Url("https://someotherserver.com:8080/something")));
        });

        it('prepends a template prefix to the pattern', () => {

            var template = new UrlTemplate("/path/{id}");
            template = template.prefix(new UrlTemplate("/org/{orgId}"));
            assert.isTrue(template.match(new Url("https://someotherserver.com:8080/org/1234/path/1?a=1")));
        });
    });
});
