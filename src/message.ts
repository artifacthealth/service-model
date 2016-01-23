import { Url } from "./url";
import { HttpStatusCode } from "./httpStatusCode";

/**
 * Represents a request to or a response from a service.
 */
export class Message {

    /**
     * The url of the request message.
     */
    url: Url;

    /**
     * The HTTP status code for a response message.
     */
    statusCode: HttpStatusCode;

    /**
     * The HTTP method (GET, POST, etc.) for a request message.
     */
    method: string;

    /**
     * The HTTP headers. If on a request message these represent the header on the request. If on a response message
     * these represent the headers that will be set on the HTTP response.
     */
    headers = new Map<string, string>();

    /**
     * The body of the message.
     */
    body: any;

    /**
     * Constructs a message.
     * @param body The body of the message.
     */
    constructor(body?: any) {

        this.body = body;
    }

    /**
     * Creates a reply message.
     * @param status The HTTP status for the reply.
     * @param body The body of the reply message.
     */
    static createReply(status: HttpStatusCode, body?: any): Message {

        var ret = new Message(body);
        ret.statusCode = status;
        return ret;
    }
}
