import ContractDescription = require("./contractDescription");
import EndpointBehavior = require("./endpointBehavior");
import Url = require("../url");

class EndpointDescription {

    behaviors: EndpointBehavior[] = [];
    contract: ContractDescription;
    address: Url;

    constructor(contract: ContractDescription, address: Url | string) {

        this.address = new Url(address);
        this.contract = contract;
    }
}

export = EndpointDescription;