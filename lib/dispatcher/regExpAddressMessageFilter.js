var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MessageFilter = require("./messageFilter");
var RegExpAddressMessageFilter = (function (_super) {
    __extends(RegExpAddressMessageFilter, _super);
    function RegExpAddressMessageFilter(pattern) {
        _super.call(this);
        if (!pattern) {
            throw new Error("Missing required argument 'pattern'.");
        }
        this._pattern = pattern;
    }
    RegExpAddressMessageFilter.prototype.match = function (message) {
        return this._pattern.test(message.url.pathname);
    };
    return RegExpAddressMessageFilter;
})(MessageFilter);
module.exports = RegExpAddressMessageFilter;
