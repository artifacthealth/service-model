import Message = require("../message");

class MessageFilter {

    match(message: Message): boolean {
        throw new Error("Not implemeneted.");
    }

    and(other: MessageFilter): MessageFilter {
        if(!other) return this;
        return new AndMessageFilter(this, other);
    }

    or(other: MessageFilter): MessageFilter {
        if(!other) return this;
        return new OrMessageFilter(this, other);
    }

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

export = MessageFilter