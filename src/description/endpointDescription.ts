import ContractDescription = require("./contractDescription");
import EndpointBehavior = require("./endpointBehavior");
import Url = require("../url");

class EndpointDescription {

    behaviors: EndpointBehavior[] = [];
    contract: ContractDescription;
    address: Url;

    constructor(contract: ContractDescription, address: Url | string) {

        if(!contract) {
            throw new Error("Missing required argument 'contract'.");
        }

        if(!address) {
            throw new Error("Missing required argument 'address'.");
        }

        this.address = new Url(address);
        this.contract = contract;
    }
}

export = EndpointDescription;