import OperationSelector = require("./operationSelector");
import Message = require("../message");
import DispatchOperation = require("./dispatchOperation");
import DispatchEndpoint = require("./dispatchEndpoint");

class RpcOperationSelector implements OperationSelector {

    private _operations: Lookup<DispatchOperation> = {};

    constructor(endpoint: DispatchEndpoint) {

        for(var i = 0; i < endpoint.operations.length; i++) {
            var operation = endpoint.operations[i];

            if(this._operations[operation.name]) {
                throw new Error("There is already an operation with name '" + operation.name + "'.");
            }

            this._operations[operation.name] = operation;
        }
    }

    selectOperation(message: Message): DispatchOperation {

        var keys = Object.keys(message.body);
        if(keys.length != 1) {
            return null;
        }

        return this._operations[keys[0]];
    }
}

export = RpcOperationSelector;