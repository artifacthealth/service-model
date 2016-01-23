import {assert} from "chai";
import {OperationContext} from "../src/operationContext";

describe('OperationContext', () => {

    describe('current', () => {

        it('gets and sets the operation context on the active domain', () => {

            // Mocha has an active domain
            var context = new OperationContext();
            OperationContext.current = context;
            assert.equal(OperationContext.current, context);
        });
    });
});
