import { Message } from "../message";

/**
 * Describes an extension point that can inspect and modify messages.
 */
export interface MessageInspector {

    /**
     * Called after a message has been received but before it has been dispatched. Returns a value that is passed
     * to beforeSendReply.
     * @param request The request message.
     */
    afterReceiveRequest(request: Message): any;

    /**
     * Called after the operation has returned but before the reply message is sent.
     * @param reply The reply message.
     * @param state The value returned from afterReceiveRequest.
     */
    beforeSendReply(reply: Message, state: any): void;
}
