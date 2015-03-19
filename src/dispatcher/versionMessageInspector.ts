import MessageInspector = require("./messageInspector");
import Message = require("../message");

/**
 * Message inspector adds Vary header to response for endpoints that use versioning.
 */
class VersionMessageInspector implements MessageInspector {

    afterReceiveRequest(request: Message): any {
        return undefined;
    }

    beforeSendReply(reply: Message, state: any): void {

        if(!reply) return;

        var value = reply.headers["Vary"];
        if(value) {
            if(value != '*') {
                value += ", Accept-Version";
            }
        }
        else {
            value = "Accept-Version";
        }
        reply.headers["Vary"] = value;
    }
}

export = VersionMessageInspector;