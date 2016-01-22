import { Operation, Contract, Versioning } from "../../src/decorators";
import { ResultCallback } from "../../src/common/resultCallback";

@Contract("Calculator1")
@Contract("Calculator2")
export class ServiceWithMultipleContracts {

    @Operation({ name: "add2", contract: "Calculator1" })
    add(x: number, y: number, callback: ResultCallback<number>): void {

        callback(null, x + y);
    }

    @Operation({ contract: "Calculator2" })
    subtract(x: number | string, y: number, callback: ResultCallback<number>): void {

        callback(null, <number>x - y);
    }

    @Operation({ contract: "Calculator2" })
    divide(x: number, y: number, callback: ResultCallback<number>): void {

        callback(null, x / y);
    }
}
