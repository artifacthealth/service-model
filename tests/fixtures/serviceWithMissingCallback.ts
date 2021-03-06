import { Operation, Contract, Debug } from "../../src/decorators";
import { ResultCallback } from "../../src/common/callbackUtil";

@Debug()
@Contract("Calculator")
export class ServiceWithMissingCallback {

    @Operation()
    add(x: number, y: number): number {

        return x + y;
    }
}
