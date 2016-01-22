import { Operation, Contract, Versioning } from "../../src/decorators";

@Versioning({ version: "^1.0.0" })
@Contract("Calculator")
export class ServiceWithContractBehavior {


}
