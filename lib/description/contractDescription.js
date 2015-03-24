var OperationDescription = require("./operationDescription");
var ContractDescription = (function () {
    function ContractDescription(contractType, name) {
        this.behaviors = [];
        this.operations = [];
        if (!contractType) {
            throw new Error("Missing required argument 'contractType'.");
        }
        this.contractType = contractType;
        this.name = name || contractType.getName();
        if (!contractType.isInterface()) {
            this._throwInvalidContract("Contract type must be an Interface.");
        }
        var annotations = contractType.getAnnotations("serviceContract");
        if (annotations.length == 0) {
            this._throwInvalidContract("Contract type must be annotated with the @serviceContract annotation.");
        }
        this._processServiceContractAnnotation(annotations[0]);
        var properties = this.contractType.getProperties();
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            if (property.isMethod()) {
                this.operations.push(new OperationDescription(this, property));
            }
        }
    }
    ContractDescription.prototype._processServiceContractAnnotation = function (annotation) {
        if (typeof annotation !== "object") {
            return;
        }
        if (annotation.value.name !== undefined) {
            if (typeof annotation.value.name != "string") {
                this._throwAnnotationError("Expected string for property 'name'.");
            }
            this.name = annotation.value.name;
        }
        if (annotation.value.version !== undefined) {
            if (typeof annotation.value.version != "string") {
                this._throwAnnotationError("Expected string for property 'version'.");
            }
            this.version = annotation.value.version;
        }
    };
    ContractDescription.prototype._throwAnnotationError = function (message) {
        this._throwInvalidContract("Invalid annotation 'serviceContract'. " + message);
    };
    ContractDescription.prototype._throwInvalidContract = function (message) {
        throw new Error("Invalid contract '" + this.name + "'." + (message ? " " + message : ""));
    };
    return ContractDescription;
})();
module.exports = ContractDescription;
