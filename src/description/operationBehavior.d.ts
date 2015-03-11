import OperationDescription = require("./contractDescription");
import DispatchOperation = require("../dispatcher/dispatchOperation");

interface OperationBehavior {

    applyBehavior (description: OperationDescription, operation: DispatchOperation): void;
}

export = OperationBehavior;