import { OperationSelector } from "./operationSelector";
import { Message } from "../message";
import { DispatchOperation } from "./dispatchOperation";
import { DispatchEndpoint } from "./dispatchEndpoint";

export class RpcOperationSelector implements OperationSelector {

    private _operations = new Map<string, DispatchOperation>();

    constructor(endpoint: DispatchEndpoint) {

        for(var i = 0; i < endpoint.operations.length; i++) {
            var operation = endpoint.operations[i];

            if(this._operations.has(operation.name)) {
                throw new Error("There is already an operation with name '" + operation.name + "'.");
            }

            this._operations.set(operation.name, operation);
        }
    }

    selectOperation(message: Message): DispatchOperation {

        var keys = Object.keys(message.body);
        if(keys.length != 1) {
            return null;
        }

        return this._operations.get(keys[0]);
    }
}
