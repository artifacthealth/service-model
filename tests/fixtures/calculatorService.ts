import Calculator = require("./calculator");

class CalculatorService implements Calculator {

    add(x: number, y: number): number {

        return x + y;
    }

    subtract(x: number, y: number): number {

        return x - y;
    }

    divide(x: number, y: number, callback: (err: Error, result: number) => void): void {
        callback(null, x / y);
    }
}

export = CalculatorService;