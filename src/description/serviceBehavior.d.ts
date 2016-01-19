import { ServiceDescription } from "./serviceDescription";
import { DispatchService } from "../dispatcher/dispatchService";

export interface ServiceBehavior {

    applyServiceBehavior (description: ServiceDescription, service: DispatchService): void;
}
