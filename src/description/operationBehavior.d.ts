import OperationDescription = require("./operationDescription");
import DispatchOperation = require("../dispatcher/dispatchOperation");

interface OperationBehavior {

    applyOperationBehavior (description: OperationDescription, operation: DispatchOperation): void;
}

export = OperationBehavior;