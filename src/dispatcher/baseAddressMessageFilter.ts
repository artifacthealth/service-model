import MessageFilter = require("./messageFilter");
import Message = require("../message");
import Url = require("../url");

class PartialAddressMessageFilter extends MessageFilter {

    private _url: Url;

    constructor(url: Url) {
        super();

        if(!url) {
            throw new Error("Missing required argument 'url'.");
        }

        this._url = url;
    }

    match(message: Message): boolean {

        return message.url.pathname.indexOf(this._url.pathname) == 0;
    }
}

export = PartialAddressMessageFilter;