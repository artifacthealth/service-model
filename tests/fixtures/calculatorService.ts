import { Operation, Contract, Versioning } from "../../src/decorators";
import { ResultCallback } from "../../src/common/resultCallback";

@Contract("Calculator")
export class CalculatorService {

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
