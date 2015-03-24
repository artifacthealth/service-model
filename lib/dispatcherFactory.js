var reflect = require("tsreflect");
var RequestDispatcher = require("./dispatcher/requestDispatcher");
var ServiceDescription = require("./description/serviceDescription");
var DispatchService = require("./dispatcher/dispatchService");
var DispatchEndpoint = require("./dispatcher/dispatchEndpoint");
var DispatchOperation = require("./dispatcher/dispatchOperation");
var DefaultOperationInvoker = require("./dispatcher/defaultOperationInvoker");
var DefaultInstanceProvider = require("./dispatcher/defaultInstanceProvider");
var DispatcherFactory = (function () {
    function DispatcherFactory() {
        this._services = [];
        this._behaviors = {};
    }
    DispatcherFactory.prototype.addService = function (ctr, name) {
        if (!ctr) {
            throw new Error("Missing required argument 'ctr'.");
        }
        if (!this._loadedSymbols) {
            reflect.loadSync();
            this._loadedSymbols = true;
        }
        var symbol = reflect.getSymbol(ctr);
        if (!symbol) {
            throw new Error("Unable to find symbol information for '" + ctr.name + "'. Make sure you have a .d.json file in the same directory as as the module containing this constructor. See tsreflect-compiler on npm for more information.");
        }
        var service = new ServiceDescription(symbol, name || symbol.getName());
        this._services.push(service);
        return service;
    };
    DispatcherFactory.prototype.registerBehavior = function (annotationName, behavior) {
        if (!annotationName) {
            throw new Error("Missing required argument 'ctr'.");
        }
        if (!behavior) {
            throw new Error("Missing required argument 'behavior'.");
        }
        if (this._behaviors[annotationName]) {
            throw new Error("A behavior has already been register for annotation name '" + annotationName + "'.");
        }
        this._behaviors[annotationName] = behavior;
    };
    DispatcherFactory.prototype.createDispatcher = function () {
        // Build the request dispatcher
        var dispatcher = new RequestDispatcher();
        for (var i = 0; i < this._services.length; i++) {
            dispatcher.services.push(this._createDispatchService(dispatcher, this._services[i]));
        }
        for (var i = 0; i < this._services.length; i++) {
            this._applyServiceBehaviors(dispatcher.services[i], this._services[i]);
        }
        dispatcher.validate();
        return dispatcher;
    };
    DispatcherFactory.prototype._createDispatchService = function (dispatcher, service) {
        var ret = new DispatchService(dispatcher, service.name);
        for (var i = 0; i < service.endpoints.length; i++) {
            ret.endpoints.push(this._createDispatchEndpoint(ret, service.endpoints[i]));
        }
        ret.instanceProvider = new DefaultInstanceProvider(service);
        return ret;
    };
    DispatcherFactory.prototype._createDispatchEndpoint = function (service, endpoint) {
        var ret = new DispatchEndpoint(service, endpoint.address, endpoint.contract.name);
        for (var i = 0; i < endpoint.contract.operations.length; i++) {
            ret.operations.push(this._createDispatchOperation(ret, endpoint.contract.operations[i]));
        }
        return ret;
    };
    DispatcherFactory.prototype._createDispatchOperation = function (endpoint, operation) {
        var ret = new DispatchOperation(endpoint, operation.name);
        ret.isOneWay = operation.isOneWay;
        ret.invoker = new DefaultOperationInvoker(operation);
        return ret;
    };
    DispatcherFactory.prototype._applyServiceBehaviors = function (service, description) {
        // apply service behaviors
        description.behaviors.forEach(function (behavior) { return behavior.applyServiceBehavior(description, service); });
        for (var i = 0; i < description.endpoints.length; i++) {
            this._applyContractBehaviors(service.endpoints[i], description.endpoints[i].contract);
        }
        for (var i = 0; i < description.endpoints.length; i++) {
            this._applyEndpointBehaviors(service.endpoints[i], description.endpoints[i]);
        }
        for (var i = 0; i < description.endpoints.length; i++) {
            var operations = description.endpoints[i].contract.operations;
            for (var j = 0; j < operations.length; j++) {
                this._applyOperationBehaviors(service.endpoints[i].operations[j], operations[j]);
            }
        }
    };
    DispatcherFactory.prototype._applyEndpointBehaviors = function (endpoint, description) {
        description.behaviors.forEach(function (behavior) { return behavior.applyEndpointBehavior(description, endpoint); });
    };
    DispatcherFactory.prototype._applyContractBehaviors = function (endpoint, description) {
        description.behaviors.forEach(function (behavior) { return behavior.applyContractBehavior(description, endpoint); });
    };
    DispatcherFactory.prototype._applyOperationBehaviors = function (operation, description) {
        description.behaviors.forEach(function (behavior) { return behavior.applyOperationBehavior(description, operation); });
    };
    return DispatcherFactory;
})();
module.exports = DispatcherFactory;
