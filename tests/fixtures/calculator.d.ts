interface Calculator {

    add(x: number, y: number): number;
    subtract(x: number, y: number): number;

    divide(x: number, y: number, callback: (err: Error, result: number) => void): void;
}

export = Calculator;