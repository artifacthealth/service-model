import { MessageFilter } from "./messageFilter";
import { Message } from "../message";
import { Url } from "../url";

/**
 * A message filter that filters messages based on the message url path. The message is considered a match
 * if the path in the url of the message is exactly the same as the path in the url of the filter.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  MessageFilter <|-- AddressMessageFilter
 * </uml>
 */
export class AddressMessageFilter extends MessageFilter {

    /**
     * The [[Url]] to match.
     * @hidden
     */
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
