import { ContractBehavior } from "../description/contractBehavior";
import { EndpointBehavior } from "../description/endpointBehavior";
import { ContractDescription } from "../description/contractDescription";
import { VersionMessageFilter } from "../dispatcher/versionMessageFilter";
import { VersionMessageInspector } from "../dispatcher/versionMessageInspector";
import { MessageFilter } from "../dispatcher/messageFilter";
import { EndpointDescription } from "../description/endpointDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";
import { BehaviorAnnotation } from "../description/behaviorAnnotation";

export class VersioningBehavior implements ContractBehavior, EndpointBehavior, BehaviorAnnotation {

    contract: string;

    private _version: string;

    /**
     * Constructs a VersioningBehavior object.
     * @param version The current contract version.
     */
    constructor(options: VersioningOptions) {

        if(!options) {
            throw new Error("Missing required argument 'options'.");
        }

        if(!options.version) {
            throw new Error("Missing required argument 'options.version'.");
        }

        this._version = options.version;
        this.contract = options.contract;
    }

    applyContractBehavior (description: ContractDescription, endpoint: DispatchEndpoint): void {

        endpoint.filter = new VersionMessageFilter(this._version).and(endpoint.filter);
        endpoint.messageInspectors.push(new VersionMessageInspector());
    }

    applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void {

        this.applyContractBehavior(description.contract, endpoint);
    }

}

/**
 * Options for a [[VersioningBehavior]].
 */
export interface VersioningOptions {

    /**
     * The version of the service contract in [semver](http://semver.org/) format.
     */
    version: string;

    /**
     * The name of the contract that is the target of the versioning behavior. This is required for when the service has
     * more than one contract defined.
     */
    contract?: string;
}