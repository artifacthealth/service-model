/// <reference path="../typings/baseline.d.ts" />
/// <reference path="../typings/tsreflect.d.ts" />
import reflect = require("tsreflect");

import DispatcherFactory = require("../src/dispatcherFactory");
import CalculatorService = require("../tests/fixtures/calculatorService");
import RequestContext = require("../src/requestContext");
import Message = require("../src/message");
import Url = require("../src/url");

suite("RequestDispatcher", () => {

    var factory = new DispatcherFactory("services");

    var service = factory.addService(CalculatorService);
    var endpoint = service.addEndpoint("Calculator");

    var dispatcher = factory.createDispatcher();

    test("dispatch", (done) => {

        var message = new Message({"add": [1, 1]});
        message.url = new Url("/services/calculator-service/");

        var queued = dispatcher.dispatch(new DummyRequestContext(message, (err, result) => {
            done(err);
        }));

        if (!queued) {
            done(new Error("Unable to dispatch request."));
        }
    });
});


class DummyRequestContext implements RequestContext {

    private _callback: ResultCallback<Message>;

    constructor(public message: Message, callback: ResultCallback<Message>) {
        this._callback = callback;
    }

    abort(): void {
        this._callback(new Error("Aborted"));
    }

    reply(message?: Message): void {
        this._callback(null, message);
    }
}