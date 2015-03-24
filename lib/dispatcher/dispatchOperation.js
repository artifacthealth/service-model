var DispatchOperation = (function () {
    function DispatchOperation(endpoint, name) {
        this.endpoint = endpoint;
        if (!endpoint) {
            throw new Error("Missing required parameter 'endpoint'.");
        }
        if (!name) {
            throw new Error("Missing required parameter 'name'.");
        }
        this.name = name;
    }
    /**
     * Validates that the operation is correctly configured.
     */
    DispatchOperation.prototype.validate = function () {
        if (!this.formatter) {
            this._throwConfigError("Undefined 'formatter'.");
        }
        if (!this.invoker) {
            this._throwConfigError("Undefined 'invoker'.");
        }
    };
    DispatchOperation.prototype._throwConfigError = function (message) {
        throw new Error("Operation '" + this.name + "' on service '" + this.endpoint.service + "' incorrectly configured. " + message);
    };
    return DispatchOperation;
})();
module.exports = DispatchOperation;
