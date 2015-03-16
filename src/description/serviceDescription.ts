/// <reference path="../common/types.d.ts" />

import reflect = require("tsreflect");
import changeCase = require("change-case");

import EndpointDescription = require("./endpointDescription");
import ContractDescription = require("./contractDescription");
import ServiceBehavior = require("./serviceBehavior");
import Url = require("../url");

class ServiceDescription {

    name: string;
    behaviors: ServiceBehavior[] = [];
    endpoints: EndpointDescription[] = [];
    serviceSymbol: reflect.Symbol;
    baseAddress: Url;

    constructor(serviceSymbol: reflect.Symbol, baseAddress?: Url | string, name?: string) {

        this.baseAddress = new Url(baseAddress);
        this.serviceSymbol = serviceSymbol;
        this.name = name || serviceSymbol.getName();
    }

    addEndpoint(implementedContract: string, address?: string): EndpointDescription {

        var contractType = this.serviceSymbol.getDeclaredType().getInterface(implementedContract);
        if (!contractType) {
            throw new Error("Service '" + this.name + "' does not implemented contract '" + implementedContract + "'.");
        }

        var url = this.baseAddress.resolve(address);

        // validate that endpoint address is unique
        for(var i = 0; i < this.endpoints.length; i++) {
            if(this.endpoints[i].address.equals(url)) {
                throw new Error("There is already an endpoint with address '" + url + "'.");
            }
        }

        var endpoint = new EndpointDescription(new ContractDescription(contractType), url);
        this.endpoints.push(endpoint);
        return endpoint;
    }

}

export = ServiceDescription;