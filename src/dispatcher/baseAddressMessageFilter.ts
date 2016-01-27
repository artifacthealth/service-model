import { Message } from "../message";
import { Url } from "../url";
import { escape } from "../common/regExpUtil";
import { RegExpAddressMessageFilter } from "./regExpAddressMessageFilter";

/**
 * A message filter that filters messages based on the message url path. The message is considered a match
 * if path in the url of the message begins with the path in the url of the filter.
 */
export class BaseAddressMessageFilter extends RegExpAddressMessageFilter {

    /**
     * Constructs an BaseAddressMessageFilter object.
     * @param url The url to match.
     */
    constructor(url: Url) {
        super(BaseAddressMessageFilter._makeRegexp(url));
    }

    private static _makeRegexp(url: Url): RegExp {

        if(!url) {
            throw new Error("Missing required argument 'url'.");
        }

        return new RegExp("^" + escape(url.pathname), "i");
    }
}
