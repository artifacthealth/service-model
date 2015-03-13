import OperationDescription = require("./operationDescription");
import DispatchOperation = require("../dispatcher/dispatchOperation");

interface OperationBehavior {

    applyBehavior (description: OperationDescription, operation: DispatchOperation): void;
}

export = OperationBehavior;