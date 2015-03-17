import ContractBehavior = require("../description/contractBehavior");
import ContractDescription = require("../description/contractDescription");
import DispatchEndpoint = require("../dispatcher/dispatchEndpoint");
import VersionMessageFilter = require("../dispatcher/versionMessageFilter");

class VersioningBehavior implements  ContractBehavior {

    private _version: string;

    /**
     * Constructs a VersioningBehavior object.
     * @param version Optional. The current contract version. If not specified the version from the ContractDescription
     * is used.
     */
    constructor(version?: string) {
        this._version = version;
    }

    applyContractBehavior (description: ContractDescription, endpoint: DispatchEndpoint): void {

        var version = this._version || description.version;
        if(version) {
            endpoint.filter = endpoint.filter.and(new VersionMessageFilter(version))
        }
    }
}

export = VersioningBehavior;