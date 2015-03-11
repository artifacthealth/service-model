import DispatchOperation = require("./dispatchOperation");
import Message = require("../message");

interface OperationSelector {

    selectOperation(message: Message): DispatchOperation;
}

export = OperationSelector;