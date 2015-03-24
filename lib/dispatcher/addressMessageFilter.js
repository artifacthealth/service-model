var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MessageFilter = require("./messageFilter");
/**
 * A message filter that filters messages based on the message url path. The message is considered a match
 * if the path in the url of the message is exactly the same as the path in the url of the filter.
 */
var AddressMessageFilter = (function (_super) {
    __extends(AddressMessageFilter, _super);
    /**
     * Constructs an AddressMessageFilter object.
     * @param url The url to match.
     */
    function AddressMessageFilter(url) {
        _super.call(this);
        if (!url) {
            throw new Error("Missing required argument 'url'.");
        }
        this._url = url;
    }
    /**
     * Tests whether or not the message satisfies the criteria of the filter.
     * @param message The message to match.
     */
    AddressMessageFilter.prototype.match = function (message) {
        return message.url.pathname === this._url.pathname;
    };
    return AddressMessageFilter;
})(MessageFilter);
module.exports = AddressMessageFilter;
