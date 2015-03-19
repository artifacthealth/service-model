import Calculator = require("./calculator");
declare var process: any;

class CalculatorService implements Calculator {

    add(x: number, y: number): number {
        return x + y;
    }

    subtract(x: number, y: number): number {

        return x - y;
    }

    divide(x: number, y: number, callback: (err: Error, result: number) => void): void {
        throw new Error("test");
        process.nextTick(() => callback(null, x / y));
    }
}

export = CalculatorService;