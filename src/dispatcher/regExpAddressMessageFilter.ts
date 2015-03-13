import MessageFilter = require("./messageFilter");
import Message = require("../message");

class RegExpAddressMessageFilter implements MessageFilter {

    private _pattern: RegExp;

    constructor(pattern: RegExp) {

        if(!pattern) {
            throw new Error("Missing required argument 'pattern'.");
        }

        this._pattern = pattern;
    }

    match(message: Message): boolean {

        return this._pattern.test(message.url.pathname);
    }
}

export = RegExpAddressMessageFilter;