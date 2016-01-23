import { ServiceDescription } from "../description/serviceDescription";
import { Message } from "../message";

/**
 * Describes a type that can provide service insteances.
 */
export interface InstanceProvider {

    /**
     * Gets an instance of a service.
     * @param message The request message.
     */
    getInstance(message: Message): Object;
}
