import { Operation, Contract, Service, Versioning } from "../../src/decorators";
import { ResultCallback } from "../../src/common/resultCallback";

@Contract("Calculator")
@Service({ operationContext: true })
export class CalculatorService {

    @Operation({ name: "add2" })
    add(x: number, y: number, callback: ResultCallback<number>): void {

        callback(null, x + y);
    }

    @Operation()
    slowAdd(x: number, y: number, callback: ResultCallback<number>): void {

        setTimeout(() => callback(null, x + y), 50);
    }

    @Operation()
    multipleCallsToCallback(x: number, y: number, callback: ResultCallback<number>): void {

        callback(null, x + y);
        callback(null, x + y);
    }

    @Operation()
    subtract(x: number | string, y: number, callback: ResultCallback<number>): void {

        callback(null, <number>x - y);
    }

    @Operation({ timeout: 10 })
    divide(x: number, y: number, callback: ResultCallback<number>): void {

        callback(null, x / y);

    }

    mod(x: number, y: number, callback: ResultCallback<number>): void {

        callback(null, x % y);
    }

    @Operation()
    makeError(callback: Callback): void {

        callback(new Error("Some error"));
    }

    @Operation()
    throwError(callback: Callback): void {

        throw new Error("Some error");
    }

    notifyCalled = 0;
    notifyFinished = 0;

    @Operation({ isOneWay: true })
    notify(x: number, y: number, callback: Callback): void {

        this.notifyCalled++;

        setTimeout(() => {
            this.notifyFinished++;
            callback(), 10
        });
    }
}
