import MessageFilter = require("./messageFilter");
import Message = require("../message");
import UrlUtil = require("../common/urlUtil");

class AddressMessageFilter implements MessageFilter {

    private _address: string;

    constructor(address: string) {

        this._address = UrlUtil.normalize(address);
    }

    match(message: Message): boolean {

        return message.url === this._address;
    }
}

export = AddressMessageFilter;