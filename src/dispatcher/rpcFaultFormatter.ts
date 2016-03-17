import { ResultCallback } from "../common/callbackUtil";
import { Message } from "../message";
import { FaultError } from "../faultError";
import {FaultFormatter} from "./dispatchEndpoint";

/**
 * @hidden
 */
export class RpcFaultFormatter implements FaultFormatter {

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

        var message = new Message({ fault: body });
        message.statusCode = fault.statusCode;

        callback(null, message);
    }
}
