import { DispatchOperation } from "./dispatchOperation";
import { Message } from "../message";

/**
 * Describes a type that is able to choose the appropriate operation for a given message.
 */
export interface OperationSelector {

    /**
     * Chooses the appropriate operation for the given message.
     * @param message The request message.
     */
    selectOperation(message: Message): DispatchOperation;
}
