import Calculator = require("./calculator");
import OperationContract = require("../../src/decorators/operationContract");
import ServiceContract = require("../../src/decorators/serviceContract");
import Version = require("../../src/decorators/version");

declare var process: any;

@ServiceContract("Calculator")
class CalculatorService implements Calculator {

    @OperationContract({ name: "add2" })
    add(x: number, y: number): number {
        return x + y;
    }

    @OperationContract()
    subtract(x: number | string, y: number): number {

        return <number>x - y;
    }

    @OperationContract()
    divide(x: number, y: number, callback: (err: Error, result: number) => void): void {
        process.nextTick(() => callback(null, x / y));
    }
}

export = CalculatorService;