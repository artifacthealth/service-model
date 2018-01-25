import {ServiceDescription} from "../description/serviceDescription";
import {Message} from "../message";
import {Type} from "reflect-helper";
import {InstanceProvider} from "./dispatchService";
import {RequestContext} from "../operationContext";

/**
 * @hidden
 */
export class DefaultInstanceProvider implements InstanceProvider {

    private _serviceType: Type;

    constructor(description: ServiceDescription) {

        this._serviceType = description.serviceType;
    }

    getInstance(message: Message, request: RequestContext): Object {

        return this._serviceType.createInstance();
    }
}
