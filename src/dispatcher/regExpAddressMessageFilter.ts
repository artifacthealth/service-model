import { MessageFilter } from "./messageFilter";
import { Message } from "../message";

export class RegExpAddressMessageFilter extends MessageFilter {

    private _pattern: RegExp;

    constructor(pattern: RegExp) {
        super();

        if(!pattern) {
            throw new Error("Missing required argument 'pattern'.");
        }

        this._pattern = pattern;
    }

    match(message: Message): boolean {

        return this._pattern.test(message.url.pathname);
    }
}
