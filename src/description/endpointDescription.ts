import ContractDescription = require("./contractDescription");
import EndpointBehavior = require("./endpointBehavior");

class EndpointDescription {

    name: string;
    behaviors: EndpointBehavior[] = [];
    contract: ContractDescription;
    address: string;

    constructor(contract: ContractDescription, address: string, name?: string) {

        this.contract = contract;
        this.address = address;
        this.name = name;
    }
}

export = EndpointDescription;