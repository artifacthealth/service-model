var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var semver = require("semver");
var MessageFilter = require("./messageFilter");
var VersionMessageFilter = (function (_super) {
    __extends(VersionMessageFilter, _super);
    function VersionMessageFilter(version) {
        _super.call(this);
        this._cache = {};
        if (!version) {
            throw new Error("Missing required argument 'version'.");
        }
        this._version = version;
    }
    VersionMessageFilter.prototype.match = function (message) {
        var acceptVersion = message.headers["Accept-Version"];
        if (!acceptVersion)
            return true;
        var satisfies = this._cache[acceptVersion];
        if (satisfies === undefined) {
            satisfies = this._cache[acceptVersion] = semver.satisfies(this._version, acceptVersion);
        }
        return satisfies;
    };
    return VersionMessageFilter;
})(MessageFilter);
module.exports = VersionMessageFilter;
