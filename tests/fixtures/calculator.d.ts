/**
 * Calculator service contract.
 * @serviceContract version: "1.0.0"
 */
interface Calculator {

    /** @operationContract name: "add2" */
    add(x: number, y: number): number;

    subtract(x: number, y: number): number;

    divide(x: number, y: number, callback: (err: Error, result: number) => void): void;
}

export = Calculator;