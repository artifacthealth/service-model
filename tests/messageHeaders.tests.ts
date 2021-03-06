import {assert} from "chai";
import {MessageHeaders} from "../src/messageHeaders";

describe('MessageHeaders', () => {

    describe('constructor', () => {

        it('sets headers if passed in', () => {

            var obj: any = {};
            obj.someheader = "foo";

            var headers = new MessageHeaders(obj);
            assert.equal(headers.get("someheader"), "foo");
        });
    });

    describe('get', () => {

        it('gets header value for key', () => {

            var headers = new MessageHeaders();
            headers.set("Content-Type", "application/json");
            assert.equal(headers.get("content-type"), "application/json");
        });
    });

    describe('has', () => {

        it('returns true if the header is in the collection', () => {

            var headers = new MessageHeaders();
            headers.set("Content-Type", "application/json");
            assert.isTrue(headers.has("content-type"));
            assert.isFalse(headers.has("content-length"));
        });
    });

    describe('delete', () => {

        it('removes the specified header', () => {

            var headers = new MessageHeaders();
            headers.set("Content-Type", "application/json");
            assert.isTrue(headers.has("content-type"));
            headers.delete("Content-Type");
            assert.isFalse(headers.has("content-type"));
        });
    });

    describe('toObject', () => {

        it('returns the headers as an object', () => {

            var headers = new MessageHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("Something", "Some value");

            assert.deepEqual(headers.toObject(), {
                "content-type": "application/json",
                "something": "Some value"
            });
        });
    });

    describe('merge', () => {

        it('clones source object if target is empty', () => {

            var source = new MessageHeaders();
            source.set("Content-Type", "application/json");
            source.set("Something", "Some value");

            var target = new MessageHeaders();
            target.merge(source);

            assert.deepEqual(target.toObject(), source.toObject());
        });

        it('merges in source headers', () => {

            var source = new MessageHeaders();
            source.set("Content-Type", "application/json");

            var target = new MessageHeaders();
            target.set("Something", "Some value");

            target.merge(source);

            assert.deepEqual(target.toObject(), {
                "content-type": "application/json",
                "something": "Some value"
            });
        });
    });
});
