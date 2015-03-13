import Message = require("../message");

interface MessageInspector {

    /**
     * Called after a message has been received but before it has been dispatched. Returns a value that is passed
     * to beforeSendReply.
     * @param request The request message.
     */
    afterReceiveRequest(request: Message): any;

    /**
     * Called after the operation has returned but before the reply message is sent.
     * @param reply The reply message. The value is undefined if the operation is one way.
     * @param state The value returned from afterReceiveRequest.
     */
    beforeSendReply(reply: Message, state: any): void;
}

export = MessageInspector;