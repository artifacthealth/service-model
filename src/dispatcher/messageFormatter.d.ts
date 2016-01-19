import { ResultCallback } from "../common/resultCallback";
import { Message } from "../message";
import { FaultError } from "../faultError";

export interface MessageFormatter {

    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void;
    serializeReply(result: any, callback: ResultCallback<Message>): void;
}
