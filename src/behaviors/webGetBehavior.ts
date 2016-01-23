import {OperationBehavior} from "../description/operationBehavior";
import {OperationDescription} from "../description/operationDescription";
import {DispatchOperation} from "../dispatcher/dispatchOperation";
import {BehaviorAnnotation} from "../description/behaviorAnnotation";

export class WebGetBehavior implements OperationBehavior, BehaviorAnnotation {

    contract: string;

    applyOperationBehavior(description: OperationDescription, operation: DispatchOperation): void {
    }
}