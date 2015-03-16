import Url = require("./url");
import HttpStatusCode = require("./httpStatusCode");

class Message {

    url: Url;
    status: HttpStatusCode;
    method: string;
    headers: Lookup<string> = {};

    body: any;

    constructor(body?: any) {

        this.body = body;
    }

    setHeader(name: string, value: string): void {
        if(!this.headers) {
            this.headers = {};
        }
        this.headers[name] = value;
    }

    getHeader(name: string): string {
        if(!this.headers) return undefined;
        return this.headers[name];
    }

    static create(status: HttpStatusCode): Message {

        var ret = new Message();
        ret.status = status;
        return ret;
    }
}

export = Message;