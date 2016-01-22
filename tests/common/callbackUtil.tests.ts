import {assert} from "chai";
import {onlyOnce} from "../../src/common/callbackUtil";

describe('CallbackUtil', () => {

    describe('onlyOnce', () => {

        it('returns a callback that throws an error if called more than once', () => {

            var called = 0;

            var once = onlyOnce(test);
            once();
            assert.equal(called, 1);
            assert.throws(once, "Callback was already called.");

            function test(err?: Error, result?: any): void {
                called++;
            }
        });
    });
});
