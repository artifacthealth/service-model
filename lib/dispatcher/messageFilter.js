var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Base class for classes used to filter messages. Not intended to be instantiated directly.
 */
var MessageFilter = (function () {
    function MessageFilter() {
    }
    /**
     * When overridden in a derived class, tests whether or not the message satisfies the criteria of the filter.
     * @param message The message to match.
     */
    MessageFilter.prototype.match = function (message) {
        throw new Error("Not implemeneted.");
    };
    /**
     * Returns a new filter that is the logical AND of the current filter and the 'other' filter.
     * @param other The filter to combine with the current filter.
     */
    MessageFilter.prototype.and = function (other) {
        if (!other)
            return this;
        return new AndMessageFilter(this, other);
    };
    /**
     * Returns a new filter that is the logical OR of the current filter and the 'other' filter.
     * @param other The filter to combine with the current filter.
     */
    MessageFilter.prototype.or = function (other) {
        if (!other)
            return this;
        return new OrMessageFilter(this, other);
    };
    /**
     * Returns a new filter that is the logical NOT of the current filter.
     */
    MessageFilter.prototype.not = function () {
        return new NotMessageFilter(this);
    };
    return MessageFilter;
})();
var AndMessageFilter = (function (_super) {
    __extends(AndMessageFilter, _super);
    function AndMessageFilter(filter1, filter2) {
        _super.call(this);
        this._filter1 = filter1;
        this._filter2 = filter2;
    }
    AndMessageFilter.prototype.match = function (message) {
        return this._filter1.match(message) && this._filter2.match(message);
    };
    return AndMessageFilter;
})(MessageFilter);
var OrMessageFilter = (function (_super) {
    __extends(OrMessageFilter, _super);
    function OrMessageFilter(filter1, filter2) {
        _super.call(this);
        this._filter1 = filter1;
        this._filter2 = filter2;
    }
    OrMessageFilter.prototype.match = function (message) {
        return this._filter1.match(message) || this._filter2.match(message);
    };
    return OrMessageFilter;
})(MessageFilter);
var NotMessageFilter = (function (_super) {
    __extends(NotMessageFilter, _super);
    function NotMessageFilter(filter) {
        _super.call(this);
        this._filter = filter;
    }
    NotMessageFilter.prototype.match = function (message) {
        return !this._filter.match(message);
    };
    return NotMessageFilter;
})(MessageFilter);
module.exports = MessageFilter;
