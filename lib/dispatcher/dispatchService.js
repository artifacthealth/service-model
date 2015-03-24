var DispatchService = (function () {
    function DispatchService(dispatcher, name) {
        this.dispatcher = dispatcher;
        this.endpoints = [];
        /**
         * Specifies whether to create an OperationContext for operations in this service. The default value is 'true'.
         */
        this.operationContextRequired = true;
        if (!dispatcher) {
            throw new Error("Missing required parameter 'dispatcher'.");
        }
        if (!name) {
            throw new Error("Missing required parameter 'name'.");
        }
        this.name = name;
    }
    /**
     * Validates that the service is correctly configured.
     */
    DispatchService.prototype.validate = function () {
        if (!this.instanceProvider) {
            this._throwConfigError("Undefined 'instanceProvider'.");
        }
        this.endpoints.forEach(function (endpoint) { return endpoint.validate(); });
    };
    DispatchService.prototype._throwConfigError = function (message) {
        throw new Error("Service '" + this.name + "' incorrectly configured." + message);
    };
    return DispatchService;
})();
module.exports = DispatchService;
