import { ResultCallback } from "../common/resultCallback";
import { Message } from "../message";
import { FaultError } from "../faultError";

export interface FaultFormatter {

    serializeFault(fault: FaultError, callback: ResultCallback<Message>): void;
}
