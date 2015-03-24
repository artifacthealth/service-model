var VersionMessageFilter = require("../dispatcher/versionMessageFilter");
var VersionMessageInspector = require("../dispatcher/versionMessageInspector");
var VersioningBehavior = (function () {
    /**
     * Constructs a VersioningBehavior object.
     * @param version Optional. The current contract version. If not specified the version from the ContractDescription
     * is used.
     */
    function VersioningBehavior(version) {
        this._version = version;
    }
    VersioningBehavior.prototype.applyContractBehavior = function (description, endpoint) {
        var version = this._version || description.version;
        if (version) {
            endpoint.filter = new VersionMessageFilter(version).and(endpoint.filter);
            endpoint.messageInspectors.push(new VersionMessageInspector());
        }
    };
    VersioningBehavior.prototype.applyEndpointBehavior = function (description, endpoint) {
        this.applyContractBehavior(description.contract, endpoint);
    };
    return VersioningBehavior;
})();
module.exports = VersioningBehavior;
