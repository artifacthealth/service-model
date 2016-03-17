import { Operation, Contract, WebGet, InjectBody } from "../../src/decorators";
import { ResultCallback } from "../../src/common/callbackUtil";

export class SomeType {

}

@Contract("MultipleInjectBody")
export class ServiceWithMultipleInjectBody {

    @Operation()
    @WebGet("/test")
    test(@InjectBody() a: SomeType, @InjectBody() b: SomeType, callback: Callback): void {

    }
}

