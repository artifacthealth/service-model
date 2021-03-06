import { ServiceDescription, ServiceBehavior } from "../description/serviceDescription";
import { DispatchService } from "../dispatcher/dispatchService";

/**
 * Service behavior that allows for configuration of service options.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  ServiceBehavior <|.. ServiceBehaviorAnnotation
 * </uml>
 */
export class ServiceBehaviorAnnotation implements ServiceBehavior {

    /**
     * The name of the service.
     */
    name: string;

    /**
     * Specifies whether to create an OperationContext for operations in this service. The default value is 'false'.
     */
    createOperationContext: boolean;

    constructor(options: ServiceOptions) {

        if(!options) {
            throw new Error("Missing required argument 'options'.");
        }

        this.name = options.name;
        this.createOperationContext = options.createOperationContext;
    }

    applyServiceBehavior(description: ServiceDescription, service: DispatchService): void {

        if(this.name != null) {
            service.name = this.name;
        }

        if(this.createOperationContext != null) {
            service.createOperationContext = this.createOperationContext;
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
    createOperationContext?: boolean;
}