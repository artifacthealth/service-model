var DispatchEndpoint = (function () {
    function DispatchEndpoint(service, address, contractName) {
        this.service = service;
        this.filterPriority = 0;
        this.operations = [];
        this.messageInspectors = [];
        this.errorHandlers = [];
        if (!service) {
            throw new Error("Missing required parameter 'service'.");
        }
        if (!address) {
            throw new Error("Missing required parameter 'address'.");
        }
        if (!contractName) {
            throw new Error("Missing required parameter 'contractName'.");
        }
        this.address = address;
        this.contractName = contractName;
    }
    /**
     * Validates that the endpoint is correctly configured.
     */
    DispatchEndpoint.prototype.validate = function () {
        if (!this.filter) {
            this._throwConfigError("Undefined 'filter'.");
        }
        if (!this.operationSelector) {
            this._throwConfigError("Undefined 'operationSelector'.");
        }
        if (!this.faultFormatter) {
            this._throwConfigError("Undefined 'faultFormatter'.");
        }
    };
    DispatchEndpoint.prototype._throwConfigError = function (message) {
        throw new Error("Endpoint at address '" + this.address + "' incorrectly configured." + message);
    };
    DispatchEndpoint.prototype.chooseOperation = function (message) {
        var operation = this.operationSelector.selectOperation(message);
        if (!operation) {
            operation = this.unhandledOperation;
        }
        return operation;
    };
    return DispatchEndpoint;
})();
module.exports = DispatchEndpoint;
