var RpcFaultFormatter = require("../dispatcher/rpcFaultFormatter");
var RpcMessageFormatter = require("../dispatcher/rpcMessageFormatter");
var RpcOperationSelector = require("../dispatcher/rpcOperationSelector");
var AddressMessageFilter = require("../dispatcher/addressMessageFilter");
var RpcBehavior = (function () {
    function RpcBehavior() {
    }
    RpcBehavior.prototype.applyEndpointBehavior = function (description, endpoint) {
        endpoint.faultFormatter = new RpcFaultFormatter();
        endpoint.operationSelector = new RpcOperationSelector(endpoint);
        endpoint.filter = new AddressMessageFilter(endpoint.address).and(endpoint.filter);
        // Note that we assume the operations in the dispatcher line up with the operations in the description. This is
        // true if the dispatcher is created through the DispatcherFactory but could be incorrect otherwise. We'll at
        // least check that the names are the same.
        var operations = description.contract.operations;
        for (var i = 0; i < operations.length; i++) {
            if (endpoint.operations[i].name != operations[i].name) {
                throw new Error("Mismatch between operations in DispatchEndpoint and EndpointDescription");
            }
            endpoint.operations[i].formatter = new RpcMessageFormatter(operations[i]);
        }
    };
    return RpcBehavior;
})();
module.exports = RpcBehavior;
