import MessageFilter = require("./messageFilter");
import Message = require("../message");
import Url = require("../url");

/**
 * A message filter that filters messages based on the message url path. The message is considered a match
 * if the path in the url of the message is exactly the same as the path in the url of the filter.
 */
class AddressMessageFilter extends MessageFilter {

    private _url: Url;

    /**
     * Constructs an AddressMessageFilter object.
     * @param url The url to match.
     */
    constructor(url: Url) {
        super();

        if(!url) {
            throw new Error("Missing required argument 'url'.");
        }

        this._url = url;
    }

    /**
     * Tests whether or not the message satisfies the criteria of the filter.
     * @param message The message to match.
     */
    match(message: Message): boolean {

        return message.url.pathname === this._url.pathname;
    }
}

export = AddressMessageFilter;