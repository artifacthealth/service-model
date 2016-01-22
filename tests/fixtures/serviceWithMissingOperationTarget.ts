import { Operation, Contract, Versioning } from "../../src/decorators";
import { ResultCallback } from "../../src/common/resultCallback";

@Contract("Calculator1")
@Contract("Calculator2")
export class ServiceWithMissingOperationTarget {

    @Operation()
    add(x: number, y: number, callback: ResultCallback<number>): void {

        callback(null, x + y);
    }
}
