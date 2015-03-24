var url = require("url");
var Url = (function () {
    function Url(address) {
        if (!address)
            return;
        var parsed = url.parse(address.toString());
        this.protocol = parsed.protocol;
        this.hostname = parsed.hostname;
        this.port = parsed.port;
        this.pathname = Url.normalize(parsed.pathname);
        this.query = parsed.query;
        this.hash = parsed.hash;
    }
    Url.prototype.resolve = function (address) {
        if (!address) {
            return this;
        }
        var other;
        if (typeof address === "string") {
            other = new Url(address);
        }
        else {
            other = address;
        }
        return new Url(url.resolve(this.toString() + "/", other.pathname));
    };
    Url.prototype.equals = function (other) {
        if (!other)
            return false;
        return this.protocol === other.protocol && this.hostname === other.hostname && this.port === other.port && this.pathname === other.pathname && this.query === other.query && this.hash === other.hash;
    };
    Url.prototype.clone = function () {
        var clone = new Url();
        clone.protocol = this.protocol;
        clone.hostname = this.hostname;
        clone.port = this.port;
        clone.pathname = this.pathname;
        clone.query = this.query;
        clone.hash = this.hash;
        return clone;
    };
    Url.prototype.toString = function () {
        return url.format(this);
    };
    Url.normalize = function (path) {
        if (!path)
            return "/";
        // Ensure leading slash
        if (path[0] !== "/") {
            path = "/" + path;
        }
        // Remove trailing slash
        if (path[path.length - 1] === "/") {
            path = path.substring(0, path.length - 1);
        }
        return path;
    };
    return Url;
})();
module.exports = Url;
