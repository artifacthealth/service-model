import { Message } from "../message";

/**
 * Base class for classes used to filter messages. Not intended to be instantiated directly.
 */
export class MessageFilter {

    /**
     * When overridden in a derived class, tests whether or not the message satisfies the criteria of the filter.
     * @param message The message to match.
     */
    match(message: Message): boolean {
        throw new Error("Not implemeneted.");
    }

    /**
     * Returns a new filter that is the logical AND of the current filter and the 'other' filter.
     * @param other The filter to combine with the current filter.
     */
    and(other: MessageFilter): MessageFilter {
        if(!other) return this;
        return new AndMessageFilter(this, other);
    }

    /**
     * Returns a new filter that is the logical OR of the current filter and the 'other' filter.
     * @param other The filter to combine with the current filter.
     */
    or(other: MessageFilter): MessageFilter {
        if(!other) return this;
        return new OrMessageFilter(this, other);
    }

    /**
     * Returns a new filter that is the logical NOT of the current filter.
     */
    not(): MessageFilter {
        return new NotMessageFilter(this);
    }
}

class AndMessageFilter extends MessageFilter {

    private _filter1: MessageFilter;
    private _filter2: MessageFilter;

    constructor(filter1: MessageFilter, filter2: MessageFilter) {
        super();

        this._filter1 = filter1;
        this._filter2 = filter2;
    }

    match(message: Message): boolean {
        return this._filter1.match(message) && this._filter2.match(message);
    }
}

class OrMessageFilter extends MessageFilter {

    private _filter1: MessageFilter;
    private _filter2: MessageFilter;

    constructor(filter1: MessageFilter, filter2: MessageFilter) {
        super();

        this._filter1 = filter1;
        this._filter2 = filter2;
    }

    match(message: Message): boolean {
        return this._filter1.match(message) || this._filter2.match(message);
    }
}

class NotMessageFilter extends MessageFilter {

    private _filter: MessageFilter;

    constructor(filter: MessageFilter) {
        super();

        this._filter = filter;
    }

    match(message: Message): boolean {
        return !this._filter.match(message);
    }
}
