/// <reference path="../typings/node-es6.d.ts" />

import { Url } from "./url";
import { HttpStatusCode } from "./httpStatusCode";

export class Message {

    url: Url;
    statusCode: HttpStatusCode;
    method: string;
    headers = new Map<string, string>();

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
