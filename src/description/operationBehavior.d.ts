import { OperationDescription } from "./operationDescription";
import { DispatchOperation } from "../dispatcher/dispatchOperation";

export interface OperationBehavior {

    applyOperationBehavior (description: OperationDescription, operation: DispatchOperation): void;
}
