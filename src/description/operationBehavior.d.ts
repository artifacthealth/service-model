import { OperationDescription } from "./operationDescription";
import { DispatchOperation } from "../dispatcher/dispatchOperation";

/**
 * Describes a type that can be used to extend the behavior of an operation.
 */
export interface OperationBehavior {

    /**
     * Applies the a behavior extension to a [[DispatchOperation]].
     * @param description A description of the operation.
     * @param operation The runtime operation.
     */
    applyOperationBehavior (description: OperationDescription, operation: DispatchOperation): void;
}
