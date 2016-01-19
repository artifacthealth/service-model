import { ContractDescription } from "./contractDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";

export interface ContractBehavior {

    applyContractBehavior (description: ContractDescription, endpoint: DispatchEndpoint): void;
}
