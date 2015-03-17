import ContractDescription = require("./contractDescription");
import DispatchEndpoint = require("../dispatcher/dispatchEndpoint");

interface ContractBehavior {

    applyContractBehavior (description: ContractDescription, endpoint: DispatchEndpoint): void;
}

export = ContractBehavior;