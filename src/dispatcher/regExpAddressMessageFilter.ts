import { MessageFilter } from "./messageFilter";
import { Message } from "../message";

/**
 * A message filter that filters message where the url pathname match a given regular expression.
 */
export class RegExpAddressMessageFilter extends MessageFilter {

    /**
     * @hidden
     */
    private _pattern: RegExp;

    /**
     * Constructs a message filter.
     * @param pattern The regular expression that is required to match the url pathname.
     */
    constructor(pattern: RegExp) {
        super();

        if(!pattern) {
            throw new Error("Missing required argument 'pattern'.");
        }

        this._pattern = pattern;
    }
    /**
     * Tests whether or not the message satisfies the criteria of the filter.
     * @param message The message to match.
     */
    match(message: Message): boolean {

        return this._pattern.test(message.url.pathname);
    }
}
