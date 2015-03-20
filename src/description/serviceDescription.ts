/// <reference path="../../typings/tsreflect.d.ts" />

import reflect = require("tsreflect");

import EndpointDescription = require("./endpointDescription");
import EndpointBehavior = require("./endpointBehavior");
import ContractDescription = require("./contractDescription");
import ServiceBehavior = require("./serviceBehavior");
import Url = require("../url");

class ServiceDescription {

    name: string;
    behaviors: ServiceBehavior[] = [];
    endpoints: EndpointDescription[] = [];
    serviceSymbol: reflect.Symbol;

    constructor(serviceSymbol: reflect.Symbol, name?: string) {

        if(!serviceSymbol) {
            throw new Error("Missing required argument 'serviceSymbol'.");
        }

        this.serviceSymbol = serviceSymbol;
        this.name = name || serviceSymbol.getName();
    }

    addEndpoint(implementedContract: string, address: Url | string, behaviors?: EndpointBehavior | EndpointBehavior[]): EndpointDescription {

        if(!implementedContract) {
            throw new Error("Missing required argument 'implementedContract'.");
        }

        if(!address) {
            throw new Error("Missing required argument 'address'.");
        }

        var contractType = this.serviceSymbol.getDeclaredType().getInterface(implementedContract);
        if (!contractType) {
            throw new Error("Service '" + this.name + "' does not implemented contract '" + implementedContract + "'.");
        }

        var endpoint = new EndpointDescription(new ContractDescription(contractType), address);
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