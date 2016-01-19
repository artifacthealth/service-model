import { DispatchOperation } from "./dispatchOperation";
import { Message } from "../message";

export interface OperationSelector {

    selectOperation(message: Message): DispatchOperation;
}
