var EndpointDescription = require("./endpointDescription");
var ContractDescription = require("./contractDescription");
var ServiceDescription = (function () {
    function ServiceDescription(serviceSymbol, name) {
        this.behaviors = [];
        this.endpoints = [];
        if (!serviceSymbol) {
            throw new Error("Missing required argument 'serviceSymbol'.");
        }
        this.serviceSymbol = serviceSymbol;
        this.name = name || serviceSymbol.getName();
    }
    ServiceDescription.prototype.addEndpoint = function (implementedContract, address, behaviors) {
        if (!implementedContract) {
            throw new Error("Missing required argument 'implementedContract'.");
        }
        if (!address) {
            throw new Error("Missing required argument 'address'.");
        }
        var contractType = this.serviceSymbol.getDeclaredType().getInterface(implementedContract);
        if (!contractType) {
            throw new Error("Service '" + this.name + "' does not implemented contract '" + implementedContract + "'.");
        }
        var endpoint = new EndpointDescription(new ContractDescription(contractType), address);
        this.endpoints.push(endpoint);
        if (behaviors) {
            if (Array.isArray(behaviors)) {
                endpoint.behaviors = endpoint.behaviors.concat(behaviors);
            }
            else {
                endpoint.behaviors.push(behaviors);
            }
        }
        return endpoint;
    };
    return ServiceDescription;
})();
module.exports = ServiceDescription;
