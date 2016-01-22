import { Operation, Contract, Versioning } from "../../src/decorators";

@Versioning({ version: "^1.0.0", contract: "Foo" })
@Contract("Calculator1")
@Contract("Calculator2")
export class ServiceWithBadTargetContract {


}
