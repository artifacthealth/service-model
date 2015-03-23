import MessageFilter = require("./messageFilter");
import Message = require("../message");
import Url = require("../url");

/**
 * A message filter that filters messages based on the message url path. The message is considered a match
 * if path in the url of the message begins with the path in the url of the filter.
 */
class BaseAddressMessageFilter extends MessageFilter {

    private _url: Url;

    /**
     * Constructs an BaseAddressMessageFilter object.
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

        return message.url.pathname.indexOf(this._url.pathname) == 0;
    }
}

export = BaseAddressMessageFilter;