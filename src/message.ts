import Url = require("./url");
import HttpStatusCode = require("./httpStatusCode");

class Message {

    url: Url;
    statusCode: HttpStatusCode;
    method: string;
    headers: Lookup<string> = {};

    body: any;

    constructor(body?: any) {

        this.body = body;
    }

    static createReply(status: HttpStatusCode, body?: any): Message {

        var ret = new Message(body);
        ret.statusCode = status;
        return ret;
    }
}

export = Message;