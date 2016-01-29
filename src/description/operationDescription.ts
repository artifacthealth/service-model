import { OperationBehavior } from "./operationBehavior"
import { ContractDescription } from "./contractDescription";
import { Method } from "reflect-helper";

/**
 * A description of a service contract operation.
 *
 * <uml>
 * hide members
 * hide circle
 * ContractDescription *-- OperationDescription : operations
 * OperationDescription *- OperationBehavior : behaviors
 * OperationDescription *-- Method : method
 * </uml>
 */
export class OperationDescription {

    /**
     * The name of the operation.
     */
    name: string;

    /**
     * The contract that owns the operation.
     */
    contract: ContractDescription;

    /**
     * A list of behaviors that extend the operation.
     */
    behaviors: OperationBehavior[] = [];

    /**
     * Metadata information for the method that is called by the operation.
     */
    method: Method;

    /**
     * Indicates if the operation is one way. If true the dispatcher does not wait for the operation to complete before
     * sending a response to the client.
     */
    isOneWay: boolean;

    /**
     * Timeout for the operation in milliseconds. If not specified defaults to a minute. A value of 0 indicates that operation does not timeout.
     */
    timeout: number;

    /**
     * Constructs an [[OperationDescription]].
     * @param contract The contract that owns the operation.
     * @param method The service method that is called by the operation.
     * @param name The name of the operation. If not specified, defaults to the name of the method.
     */
    constructor(contract: ContractDescription, method: Method, name?: string) {

        if(!contract) {
            throw new Error("Missing required argument 'contract'.");
        }

        if(!method) {
            throw new Error("Missing required argument 'method'.");
        }

        this.contract = contract;
        this.method = method;
        this.name = name || method.name;
    }
}
