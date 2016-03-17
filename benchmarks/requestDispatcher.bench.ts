import { DispatcherFactory } from "../src/dispatcherFactory";
import { CalculatorService } from "../tests/fixtures/calculatorService";
import { Message } from "../src/message";
import { Url } from "../src/url";
import { FaultError } from "../src/faultError";
import { HttpError } from "../src/httpError";
import { HttpStatusCode } from "../src/httpStatusCode";
import { OperationContext, RequestContext } from '../src/operationContext';
import { VersioningBehavior } from "../src/behaviors/versioningBehavior";
import { RpcBehavior } from "../src/behaviors/rpcBehavior";
import { DebugBehavior } from "../src/behaviors/debugBehavior";
import { ResultCallback } from "../src/common/callbackUtil";
import { DummyRequestContext } from "../tests/dummRequestContext";

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
    message.headers.set("Accept-Version", "^1.0.0");
    message.url = new Url("/services/calculator-service/");

    test("dispatch", (done) => {
        dispatcher.dispatch(new DummyRequestContext(message, done));
    });

    after((done) => {
        dispatcher.close(done);
    })
});

