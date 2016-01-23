import { ResultCallback } from "../common/resultCallback";
import { Message } from "../message";
import { FaultError } from "../faultError";

/**
 * Describes a type that can serialize response messages for a service endpoint.
 */
export interface FaultFormatter {

    serializeFault(fault: FaultError, callback: ResultCallback<Message>): void;
}
