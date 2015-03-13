import MessageFilter = require("./messageFilter");
import Message = require("../message");
import Url = require("../url");

class AddressMessageFilter implements MessageFilter {

    private _url: Url;

    constructor(url: Url) {

        if(!url) {
            throw new Error("Missing required argument 'url'.");
        }

        this._url = url;
    }

    match(message: Message): boolean {

        return message.url.pathname === this._url.pathname;
    }
}

export = AddressMessageFilter;