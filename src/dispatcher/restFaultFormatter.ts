import { ResultCallback } from "../common/resultCallback";
import { FaultFormatter } from "./faultFormatter";
import { Message } from "../message";
import { FaultError } from "../faultError";

/**
 * @hidden
 */
export class RestFaultFormatter implements FaultFormatter {

    serializeFault(fault: FaultError, callback: ResultCallback<Message>): void {

        var body: any = {
            message: fault.message
        }

        if(fault.code) {
            body.code = fault.code;
        }

        if(fault.detail != null) {
            body.detail = fault.detail;
        }

        var message = new Message(body);
        message.statusCode = fault.statusCode;

        callback(null, message);
    }
}
