/// <reference path="../common/types.d.ts" />

import reflect = require("tsreflect");

import InstanceProvider = require("./instanceProvider");
import ServiceDescription = require("../description/serviceDescription");
import Message = require("../message");

class DefaultInstanceProvider implements InstanceProvider {

    private _serviceType: reflect.Type;

    constructor(description: ServiceDescription) {

        this._assertParameterlessConstructor(description.serviceSymbol);
        this._serviceType = description.serviceSymbol.getDeclaredType();
    }

    getInstance(message: Message): Object {

        return this._serviceType.createInstance([]);
    }

    private _assertParameterlessConstructor(serviceSymbol: reflect.Symbol): void {

        if(!serviceSymbol.isClass()) {
            this._throwInvalidServiceType(serviceSymbol.getName(), "Type must be a Class.");
        }

        // Get the constructor signatures from the static side of the type
        var constructors = serviceSymbol.getType().getConstructSignatures(),
            found = constructors.length == 0;

        for(var i = 0; i < constructors.length; i++) {
            if(constructors[i].getParameters().length == 0) {
                found = true;
                break;
            }
        }

        if(!found) {
            this._throwInvalidServiceType(serviceSymbol.getName(), "Class must have a parameterless constructor.");
        }
    }

    private _throwInvalidServiceType(name: string, message: string): void {
        throw new Error("Invalid service type '" + name + "'. " + message);
    }
}

export = DefaultInstanceProvider;