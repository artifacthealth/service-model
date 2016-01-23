import { ResultCallback } from "../common/resultCallback";
import { Message } from "../message";
import { FaultError } from "../faultError";

/**
 * Represents a type that is able to deserialize requests and serialize replies.
 */
export interface MessageFormatter {

    /**
     * Deserialize a request message.
     * @param message The request message.
     * @param callback Called with a list of arguments that will be applied to the operation.
     */
    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void;

    /**
     * Serializes a reply message.
     * @param result The result from the operation.
     * @param callback Called with the reply message.
     */
    serializeReply(result: any, callback: ResultCallback<Message>): void;
}
