import { Message } from "../message";
import {MessageInspector} from "./dispatchEndpoint";

/**
 * Message inspector adds Vary header to response for endpoints that use versioning.
 * @hidden
 */
export class VersionMessageInspector implements MessageInspector {

    afterReceiveRequest(request: Message): any {
        return undefined;
    }

    beforeSendReply(reply: Message, state: any): void {

        if(!reply) return;

        var value = reply.headers.get("Vary");
        if(value) {
            if(value != '*') {
                value += ", Accept-Version";
            }
        }
        else {
            value = "Accept-Version";
        }
        reply.headers.set("Vary", value);
    }
}
