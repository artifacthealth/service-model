import EndpointDescription = require("./endpointDescription");
import EndpointBehavior = require("./endpointBehavior");
import ContractDescription = require("./contractDescription");
import ServiceBehavior = require("./serviceBehavior");
import Url = require("../url");
import Constructor = require("../common/constructor");
import ReflectHelper = require("./reflectHelper");

class ServiceDescription {

    name: string;
    behaviors: ServiceBehavior[] = [];
    endpoints: EndpointDescription[] = [];
    serviceConstructor: Constructor;

    constructor(serviceConstructor: Constructor, name?: string) {

        if(!serviceConstructor) {
            throw new Error("Missing required argument 'serviceConstructor'.");
        }

        this.serviceConstructor = serviceConstructor;
        this.name = name || serviceConstructor.name;
    }

    addEndpoint(contractName: string, address: Url | string, behaviors?: EndpointBehavior | EndpointBehavior[]): EndpointDescription {

        if(!contractName) {
            throw new Error("Missing required argument 'contractName'.");
        }

        if(!address) {
            throw new Error("Missing required argument 'address'.");
        }


        var contract = ReflectHelper.retrieveContract(this.serviceConstructor, contractName);
        if (!contract) {
            throw new Error("Contract '" + contractName + "' not found on service '" + this.name + "'.");
        }

        var endpoint = new EndpointDescription(contract, address);
        this.endpoints.push(endpoint);

        if(behaviors) {
            if(Array.isArray(behaviors)) {
                endpoint.behaviors = endpoint.behaviors.concat(<EndpointBehavior[]>behaviors);
            }
            else {
                endpoint.behaviors.push(<EndpointBehavior>behaviors);
            }
        }

        return endpoint;
    }
}

export = ServiceDescription;