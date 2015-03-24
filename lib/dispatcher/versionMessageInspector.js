/**
 * Message inspector adds Vary header to response for endpoints that use versioning.
 */
var VersionMessageInspector = (function () {
    function VersionMessageInspector() {
    }
    VersionMessageInspector.prototype.afterReceiveRequest = function (request) {
        return undefined;
    };
    VersionMessageInspector.prototype.beforeSendReply = function (reply, state) {
        if (!reply)
            return;
        var value = reply.headers["Vary"];
        if (value) {
            if (value != '*') {
                value += ", Accept-Version";
            }
        }
        else {
            value = "Accept-Version";
        }
        reply.headers["Vary"] = value;
    };
    return VersionMessageInspector;
})();
module.exports = VersionMessageInspector;
