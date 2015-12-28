/// <reference path="../typings/baseline.d.ts" />
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
import RpcBehavior = require("../src/behaviors/rpcBehavior");
import DebugBehavior = require("../src/behaviors/debugBehavior");
import ResultCallback = require("../src/common/resultCallback");

suite("RequestDispatcher", () => {

    var factory = new DispatcherFactory();

    var service = factory.addService(CalculatorService);
    service.addEndpoint("Calculator", "/services/calculator-service/", [new RpcBehavior()]);

    var dispatcher = factory.createDispatcher();
    dispatcher.on('closing', () => console.log("Closing..."));
    dispatcher.on('closed', () => console.log("Closed"));
    dispatcher.on('error', (err: Error) => {
        console.log("Uncaught exception...\n" + (<any>err).stack);
        dispatcher.close(() => {
            console.log("Exiting...");
            throw err;
        });
    });

    var message = new Message({"add2": [ 1, 2 ]});
    message.headers["Accept-Version"] = "^1.0.0";
    message.url = new Url("/services/calculator-service/");

    test("dispatch", (done) => {
        dispatcher.dispatch(new DummyRequestContext(message, done));
    });

    after((done) => {
        dispatcher.close(done);
    })
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

    addListener(event: string, listener: Function): RequestContext {
        return this;
    }

    removeListener(event: string, listener: Function): RequestContext {
        return this;
    }
}