import { Operation, Contract, WebGet, WebPost, WebPut, WebDelete, WebHead, InjectBody } from "../../src/decorators";
import { ResultCallback } from "../../src/common/callbackUtil";

export class SomeType {

}

@Contract("UnknownParameterType")
export class ServiceWithUnknownParameterType {

    @Operation()
    @WebGet("/test/{a}")
    test(a: SomeType, callback: Callback): void {

    }
}

