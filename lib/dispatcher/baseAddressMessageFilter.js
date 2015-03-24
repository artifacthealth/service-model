var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MessageFilter = require("./messageFilter");
/**
 * A message filter that filters messages based on the message url path. The message is considered a match
 * if path in the url of the message begins with the path in the url of the filter.
 */
var BaseAddressMessageFilter = (function (_super) {
    __extends(BaseAddressMessageFilter, _super);
    /**
     * Constructs an BaseAddressMessageFilter object.
     * @param url The url to match.
     */
    function BaseAddressMessageFilter(url) {
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
    BaseAddressMessageFilter.prototype.match = function (message) {
        return message.url.pathname.indexOf(this._url.pathname) == 0;
    };
    return BaseAddressMessageFilter;
})(MessageFilter);
module.exports = BaseAddressMessageFilter;
