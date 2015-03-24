var DefaultInstanceProvider = (function () {
    function DefaultInstanceProvider(description) {
        this._assertParameterlessConstructor(description.serviceSymbol);
        this._serviceType = description.serviceSymbol.getDeclaredType();
    }
    DefaultInstanceProvider.prototype.getInstance = function (message) {
        return this._serviceType.createInstance([]);
    };
    DefaultInstanceProvider.prototype._assertParameterlessConstructor = function (serviceSymbol) {
        if (!serviceSymbol.isClass()) {
            this._throwInvalidServiceType(serviceSymbol.getName(), "Type must be a Class.");
        }
        // Get the constructor signatures from the static side of the type
        var constructors = serviceSymbol.getType().getConstructSignatures(), found = constructors.length == 0;
        for (var i = 0; i < constructors.length; i++) {
            if (constructors[i].getParameters().length == 0) {
                found = true;
                break;
            }
        }
        if (!found) {
            this._throwInvalidServiceType(serviceSymbol.getName(), "Class must have a parameterless constructor.");
        }
    };
    DefaultInstanceProvider.prototype._throwInvalidServiceType = function (name, message) {
        throw new Error("Invalid service type '" + name + "'. " + message);
    };
    return DefaultInstanceProvider;
})();
module.exports = DefaultInstanceProvider;
