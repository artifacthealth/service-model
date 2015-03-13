import Url = require("./url");

class Message {

    url: Url;
    status: number;
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
}

export = Message;