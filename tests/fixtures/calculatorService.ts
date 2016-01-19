import { Operation, Contract } from "../../src/decorators";

@Contract("Calculator")
export class CalculatorService {

    @Operation({ name: "add2" })
    add(x: number, y: number): number {
        return x + y;
    }

    @Operation()
    subtract(x: number | string, y: number): number {

        return <number>x - y;
    }

    @Operation()
    divide(x: number, y: number, callback: (err: Error, result: number) => void): void {
        process.nextTick(() => callback(null, x / y));
    }
}
