import { ContractBehavior } from "../description/contractBehavior";
import { EndpointBehavior } from "../description/endpointBehavior";
import { ContractDescription } from "../description/contractDescription";
import { VersionMessageFilter } from "../dispatcher/versionMessageFilter";
import { VersionMessageInspector } from "../dispatcher/versionMessageInspector";
import { MessageFilter } from "../dispatcher/messageFilter";
import { EndpointDescription } from "../description/endpointDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";
import { BehaviorAttribute } from "../description/behaviorAttribute";

export class VersioningBehavior implements ContractBehavior, EndpointBehavior, BehaviorAttribute {

    contract: string;

    private _version: string;

    /**
     * Constructs a VersioningBehavior object.
     * @param version The current contract version.
     */
    constructor(args: { version: string, contract?: string }) {

        if(!args) {
            throw new Error("Missing required argument 'args'.");
        }

        if(!args.version) {
            throw new Error("Missing requird argument 'args.version'.");
        }

        this._version = args.version;
        this.contract = args.contract;
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
