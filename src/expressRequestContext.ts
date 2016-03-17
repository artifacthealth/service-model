import {RequestContext} from "./operationContext";
import {Message} from "./message";
import {Url} from "./url";
import {MessageHeaders} from "./messageHeaders";

export class ExpressRequestContext implements RequestContext {

    message: Message;
    user: any;

    /**
     * @hidden
     */
    private _res: ExpressResponse;
    /**
     * @hidden
     */
    private _req: ExpressRequest;

    constructor(req: ExpressRequest, res: ExpressResponse) {

        this._req = req;
        this._res = res;
        this.message = new Message(req.body, new MessageHeaders(req.headers));
        this.message.method = req.method;
        this.message.url = new Url(req.originalUrl);
        this.user = req.user;
    }

    abort(): void {
        this._res.status(500);
        this._res.end();
    }

    reply(message: Message): void {

        this._res.status(message.statusCode).set(message.headers.toObject());

        if(Buffer.isBuffer(message.body)) {
            this._res.end(<Buffer>message.body, 'binary');
        }
        else if(typeof message.body.pipe === "function") {
            message.body.pipe(this._res);
        }
        else {
            this._res.send(message.body);
            this._res.end();
        }
    }

    addListener(event: string, listener: Function): RequestContext {
        this._req.addListener(event, listener);
        return this;
    }

    removeListener(event: string, listener: Function): RequestContext {
        this._req.removeListener(event, listener);
        return this;
    }
}

/**
 * @hidden
 */
export interface ExpressRequest {

    body: any;
    user: any;
    method: string;
    headers: { [key: string]: string; };
    originalUrl: string;

    addListener(event: string, listener: Function): ExpressRequest;
    removeListener(event: string, listener: Function): ExpressRequest;
}

/**
 * @hidden
 */
export interface ExpressResponse {

    status(code: number): ExpressResponse;
    end(): void;
    end(data?: any, encoding?: string): void;
    set(fields: any): ExpressResponse;
    send(body: any): ExpressResponse;
}