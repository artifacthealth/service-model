import { ResultCallback } from "../common/resultCallback";

/**
 * Describes a type that can invoker service methods.
 */
export interface OperationInvoker {

    /**
     * Invokes a service method on the given service instance.
     * @param instance The service instance.
     * @param args A list of arguments applied to the method.
     * @param callback Called with result of the operation.
     */
    invoke(instance: Object, args: any[], callback: ResultCallback<any>):  void;
}
