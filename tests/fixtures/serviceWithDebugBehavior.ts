import { Operation, Contract, Debug } from "../../src/decorators";
import { ResultCallback } from "../../src/common/callbackUtil";

@Debug()
@Contract("Calculator")
export class ServiceWithDebugBehavior {

    @Operation({ name: "add2" })
    add(x: number, y: number, callback: ResultCallback<number>): void {

        callback(null, x + y);
    }

    @Operation()
    subtract(x: number | string, y: number, callback: ResultCallback<number>): void {

        callback(null, <number>x - y);
    }

    @Operation()
    divide(x: number, y: number, callback: ResultCallback<number>): void {

        callback(null, x / y);
    }
}
