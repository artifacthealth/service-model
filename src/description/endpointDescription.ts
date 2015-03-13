import ContractDescription = require("./contractDescription");
import EndpointBehavior = require("./endpointBehavior");
import Url = require("../url");

class EndpointDescription {

    name: string;
    behaviors: EndpointBehavior[] = [];
    contract: ContractDescription;
    address: Url;

    constructor(contract: ContractDescription, address: Url | string, name?: string) {

        this.address = new Url(address);
        this.contract = contract;
        this.name = name;
    }
}

export = EndpointDescription;