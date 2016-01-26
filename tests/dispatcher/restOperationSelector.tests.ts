import {assert} from "chai";
import {createEndpoint, createEndpointDescription, RestTodoService} from "../helpers";
import {Message} from "../../src/message";
import {Url} from "../../src/url";
import {RestOperationSelector} from "../../src/dispatcher/restOperationSelector";

describe('RestOperationSelector', () => {

    describe('selectOperation', () => {

        it('correctly chooses an operation based on method and url', () => {

            var message = new Message();
            message.method = "GET";
            message.url = new Url("http://somehost.com/services/todo/1");

            assert.equal(createOperationSelector().selectOperation(message).name, "getTask");
        });

        it('returns undefined if method is not mapped', () => {

            var message = new Message();
            message.method = "FOO";
            message.url = new Url("http://somehost.com/services/todo/1");

            assert.isUndefined(createOperationSelector().selectOperation(message));
        });
    });

    function createOperationSelector(): RestOperationSelector {

        return new RestOperationSelector(createEndpointDescription(RestTodoService), createEndpoint(RestTodoService));
    }
});
