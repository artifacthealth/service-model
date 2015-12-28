import ContractBehavior = require("../description/contractBehavior");
import EndpointBehavior = require("../description/endpointBehavior");
import ContractDescription = require("../description/contractDescription");
import VersionMessageFilter = require("../dispatcher/versionMessageFilter");
import VersionMessageInspector = require("../dispatcher/versionMessageInspector");
import MessageFilter = require("../dispatcher/messageFilter");
import EndpointDescription = require("../description/endpointDescription");
import DispatchEndpoint = require("../dispatcher/dispatchEndpoint");

class VersioningBehavior implements ContractBehavior, EndpointBehavior {

    private _version: string;

    /**
     * Constructs a VersioningBehavior object.
     * @param version The current contract version.
     */
    constructor(version: string) {

        if(!version) {
            throw new Error("Missing required argument 'version'.");
        }
        this._version = version;
    }

    applyContractBehavior (description: ContractDescription, endpoint: DispatchEndpoint): void {

        var version = this._version;
        if(version) {
            endpoint.filter = new VersionMessageFilter(version).and(endpoint.filter);
            endpoint.messageInspectors.push(new VersionMessageInspector());
        }
    }

    applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void {

        this.applyContractBehavior(description.contract, endpoint);
    }

}

export = VersioningBehavior;