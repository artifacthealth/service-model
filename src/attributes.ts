import { OperationBehavior } from "./description/operationBehavior";
import { OperationDescription } from "./description/operationDescription";
import { DispatchOperation } from "./dispatcher/dispatchOperation";
import { BehaviorAttribute } from "./description/behaviorAttribute";

export class ContractAttribute {

    constructor(public name?: string) {

    }
}

export class OperationAttribute {

    /**
     * The name of the operation. If not specified, defaults to the name of the method.
     */
    name: string;

    /**
     * Indicates if the operation is one way. Default is false. One-way operations immediately return to the client
     * without waiting for a result.
     */
    isOneWay: boolean;

    /**
     * Specifies the timeout for the operation. If not specified, defaults to the timeout for the service.
     */
    timeout: number;

    /**
     * Indicates the name of the target contract for this operation. This is required when the service has more than
     * one contract.
     */
    contract: string;

    constructor(args: { name?: string; isOneWay?: boolean; timeout?: number; contract?: string }) {

        if(args) {
            this.name = args.name;
            this.isOneWay = args.isOneWay;
            this.timeout = args.timeout;
            this.contract = args.contract;
        }
    }
}

export class WebGetAttribute implements OperationBehavior, BehaviorAttribute {

    contract: string;

    constructor(args: { contract?: string; }) {

        if(args) {
            this.contract = args.contract;
        }
    }

    applyOperationBehavior (description: OperationDescription, operation: DispatchOperation): void {

    }
}