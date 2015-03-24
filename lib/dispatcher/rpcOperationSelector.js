var RpcOperationSelector = (function () {
    function RpcOperationSelector(endpoint) {
        this._operations = {};
        for (var i = 0; i < endpoint.operations.length; i++) {
            var operation = endpoint.operations[i];
            if (this._operations[operation.name]) {
                throw new Error("There is already an operation with name '" + operation.name + "'.");
            }
            this._operations[operation.name] = operation;
        }
    }
    RpcOperationSelector.prototype.selectOperation = function (message) {
        var keys = Object.keys(message.body);
        if (keys.length != 1) {
            return null;
        }
        return this._operations[keys[0]];
    };
    return RpcOperationSelector;
})();
module.exports = RpcOperationSelector;
