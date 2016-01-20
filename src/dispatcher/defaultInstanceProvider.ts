import { InstanceProvider } from "./instanceProvider";
import { ServiceDescription } from "../description/serviceDescription";
import { Message } from "../message";
import { Constructor } from "../common/constructor";
import { Type } from "reflect-helper";

export class DefaultInstanceProvider implements InstanceProvider {

    private _serviceType: Type;

    constructor(description: ServiceDescription) {

        this._serviceType = description.serviceType;
    }

    getInstance(message: Message): Object {

        return this._serviceType.createInstance();
    }
}
