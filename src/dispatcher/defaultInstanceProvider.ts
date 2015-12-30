import InstanceProvider = require("./instanceProvider");
import ServiceDescription = require("../description/serviceDescription");
import Message = require("../message");
import Constructor = require("../common/constructor");

class DefaultInstanceProvider implements InstanceProvider {

    private _serviceConstructor: Constructor<any>;

    constructor(description: ServiceDescription) {

        this._assertParameterlessConstructor(description.serviceConstructor);
        this._serviceConstructor = description.serviceConstructor;
    }

    getInstance(message: Message): Object {

        var constructor = this._serviceConstructor;

        if(!constructor.prototype) {
            throw new Error("Constructor '" + constructor.name + "' does not have a prototype.");
        }

        var instance = Object.create(constructor.prototype);
        constructor.apply(instance, []);
        return instance;
    }

    private _assertParameterlessConstructor(serviceConstructor: Constructor<any>): void {

        /*
        // Get the constructor signatures from the static side of the type
        var constructors = serviceConstructor.getType().getConstructSignatures(),
            found = constructors.length == 0;

        for(var i = 0; i < constructors.length; i++) {
            if(constructors[i].getParameters().length == 0) {
                found = true;
                break;
            }
        }

        if(!found) {
            this._throwInvalidServiceType(serviceConstructor.getName(), "Class must have a parameterless constructor.");
        }
        */
    }

    private _throwInvalidServiceType(name: string, message: string): void {
        throw new Error("Invalid service type '" + name + "'. " + message);
    }
}

export = DefaultInstanceProvider;