/// <reference path="../common/types.d.ts" />

import reflect = require("tsreflect");
import url = require("url");

import EndpointDescription = require("./endpointDescription");
import ContractDescription = require("./contractDescription");
import ServiceBehavior = require("./serviceBehavior");

class ServiceDescription {

    name: string;
    behaviors: ServiceBehavior[] = [];
    endpoints: EndpointDescription[] = [];
    serviceSymbol: reflect.Symbol;
    baseAddress: string;

    constructor(serviceSymbol: reflect.Symbol, baseAddress: string, name?: string) {

        this.serviceSymbol = serviceSymbol;
        this.baseAddress = baseAddress;
        this.name = name || serviceSymbol.getName();
    }

    addServiceEndpoint(implementedContract: string, address?: string, name?: string): EndpointDescription {

        var contractType = this.serviceSymbol.getDeclaredType().getBaseType(implementedContract);
        if (!contractType) {
            throw new Error("Service '" + this.name + "' does not implemented contract '" + implementedContract + "'.");
        }

        var endpoint = new EndpointDescription(new ContractDescription(contractType), url.resolve(this.baseAddress, address || ""), name);
        this.endpoints.push(endpoint);
        return endpoint;
    }

}

export = ServiceDescription;