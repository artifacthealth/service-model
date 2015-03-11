import MessageFilter = require("./messageFilter");
import Message = require("../message");

class RegExpAddressMessageFilter implements MessageFilter {

    private _address: RegExp;

    constructor(address: RegExp) {

        this._address = address;
    }

    match(message: Message): boolean {

        return this._address.test(message.url);
    }
}

export = RegExpAddressMessageFilter;