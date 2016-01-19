import { ServiceDescription } from "../description/serviceDescription";
import { Message } from "../message";

export interface InstanceProvider {

    getInstance(message: Message): Object;
}
