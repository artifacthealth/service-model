import { ServiceBehavior } from "../description/serviceBehavior";
import { ServiceDescription } from "../description/serviceDescription";
import { DispatchService } from "../dispatcher/dispatchService";

/**
 * Allows configuration of options on a [[DispatchService]]
 */
export class ServiceBehaviorAnnotation implements ServiceBehavior {

    /**
     * The name of the service.
     */
    name: string;

    /**
     * Specifies whether to create an OperationContext for operations in this service. The default value is 'false'.
     */
    operationContext: boolean;

    constructor(options: ServiceOptions) {

        if(!options) {
            throw new Error("Missing required argument 'options'.");
        }

        this.name = options.name;
        this.operationContext = options.operationContext;
    }

    applyServiceBehavior(description: ServiceDescription, service: DispatchService): void {

        if(this.name != null) {
            service.name = this.name;
        }

        if(this.operationContext != null) {
            service.operationContextRequired = this.operationContext;
        }
    }
}

/**
 * Options for a service.
 */
export interface ServiceOptions {

    /**
     * The name of the service.
     */
    name?: string;

    /**
     * Specifies whether to create an OperationContext for operations in this service. The default value is 'false'.
     */
    operationContext?: boolean;
}