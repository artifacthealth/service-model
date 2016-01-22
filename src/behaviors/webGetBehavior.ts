import {OperationBehavior} from "../description/operationBehavior";
import {OperationDescription} from "../description/operationDescription";
import {DispatchOperation} from "../dispatcher/dispatchOperation";
import {BehaviorAttribute} from "../description/behaviorAttribute";

export class WebGetBehavior implements OperationBehavior, BehaviorAttribute {

    contract: string;

    applyOperationBehavior(description: OperationDescription, operation: DispatchOperation): void {
    }
}