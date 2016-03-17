import {RequestContext} from "../src/operationContext";
import {Message} from "../src/message";
import {ResultCallback} from "../src/common/callbackUtil";

export class DummyRequestContext implements RequestContext {

    private _callback: ResultCallback<Message>;

    constructor(public message: Message, callback?: ResultCallback<Message>) {
        this._callback = callback;
    }

    abort(): void {
        this._handleCallback(new Error("Aborted"));
    }

    reply(message?: Message): void {

        this._handleCallback(null, message);
    }

    addListener(event: string, listener: Function): RequestContext {
        return this;
    }

    removeListener(event: string, listener: Function): RequestContext {
        return this;
    }

    private _handleCallback(err?: Error, message?: Message): void {

        if(this._callback) {
            var callback = this._callback;
            process.nextTick(() => callback(err, message));
            this._callback = function () {
            };
        }
    }
}