/// <reference path="../typings/baseline.d.ts" />
/// <reference path="../typings/tsreflect.d.ts" />
import reflect = require("tsreflect");
import domain = require("domain");

import DispatcherFactory = require("../src/dispatcherFactory");
import CalculatorService = require("../tests/fixtures/calculatorService");
import RequestContext = require("../src/requestContext");
import Message = require("../src/message");
import Url = require("../src/url");
import FaultError = require("../src/faultError");
import HttpError = require("../src/httpError");
import HttpStatusCode = require("../src/httpStatusCode");
import OperationContext = require('../src/operationContext');
import VersioningBehavior = require("../src/behaviors/versioningBehavior");

suite("RequestDispatcher", () => {

    var factory = new DispatcherFactory("services");

    var service = factory.addService(CalculatorService);
    var endpoint = service.addEndpoint("Calculator");
    //endpoint.contract.behaviors.push(new VersioningBehavior());

    var dispatcher = factory.createDispatcher();
    dispatcher.on('closing', () => console.log("Closing..."));
    dispatcher.on('closed', () => console.log("Closed"));
    dispatcher.on('error', (err: Error) => {
        console.log("Uncaught exception...\n" + err.stack);
        console.log("Exiting...");
        throw err;
    });

    test("dispatch", (done) => {

        var message = new Message({"divide": [ 1, 2 ]});
        //message.headers["Accept-Version"] = "^1.0.0";
        message.url = new Url("/services/calculator-service/");

        var completed = 0;
        for(var i = 0; i < 1000; i++) {
            dispatcher.dispatch(new DummyRequestContext(message, (err, result) => {
                if(++completed == 1000) process.nextTick(() => done(err));
            }));
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