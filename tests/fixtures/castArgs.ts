import { Operation, Contract, WebGet, WebPost, WebPut, WebDelete, WebHead, InjectBody } from "../../src/decorators";
import { ResultCallback } from "../../src/common/resultCallback";

@Contract("TestCast")
export class TestCastService {

    @Operation()
    @WebGet("/number/{a}")
    testCastNumber(a: number, callback: Callback): void {

    }

    @Operation()
    @WebGet("/boolean/{a}")
    testCastBoolean(a: boolean, callback: Callback): void {

    }

    @Operation()
    @WebGet("/string/{a}")
    testCastString(a: string, callback: Callback): void {

    }

    @Operation()
    @WebGet("/date/{a}")
    testCastDate(a: Date, callback: Callback): void {

    }
}
