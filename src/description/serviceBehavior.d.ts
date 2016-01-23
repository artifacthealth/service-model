import { ServiceDescription } from "./serviceDescription";
import { DispatchService } from "../dispatcher/dispatchService";

/**
 * Describes a type that can be used to extend the behavior of a service.
 */
export interface ServiceBehavior {

    /**
     * Applies the a behavior extension to a [[DispatchService]].
     * @param description A description of the behavior.
     * @param service The runtime service.
     */
    applyServiceBehavior (description: ServiceDescription, service: DispatchService): void;
}
