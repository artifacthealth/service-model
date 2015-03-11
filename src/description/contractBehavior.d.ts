import ContractDescription = require("./contractDescription");
import DispatchEndpoint = require("../dispatcher/dispatchEndpoint");

interface ContractBehavior {

    applyBehavior (description: ContractDescription, endpoint: DispatchEndpoint): void;
}

export = ContractBehavior;