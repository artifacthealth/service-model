import { ContractBehavior } from "../description/contractBehavior";
import { EndpointBehavior } from "../description/endpointBehavior";
import { ContractDescription } from "../description/contractDescription";
import { VersionMessageFilter } from "../dispatcher/versionMessageFilter";
import { VersionMessageInspector } from "../dispatcher/versionMessageInspector";
import { MessageFilter } from "../dispatcher/messageFilter";
import { EndpointDescription } from "../description/endpointDescription";
import { DispatchEndpoint } from "../dispatcher/dispatchEndpoint";
import { BehaviorAnnotation } from "../description/behaviorAnnotation";

/**
 * Contract and endpoint behavior that allows an endpoint to be selected by version number as specified by the client.
 * The version of the contract must be provided in [semver](http://semver.org/) format. The behavior can be applied to
 * a contract using the [[Versioning]] decorator or to a specific endpoint by adding an instance of VersioningBehavior
 * to the list of behaviors for the endpoint.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  ContractBehavior <|.. VersioningBehavior
 *  EndpointBehavior <|.. VersioningBehavior
 * </uml>
 *
 * ### Example
 *
 * ```typescript
 *  @Contract("Calculator")
 *  @Versioning({ version: "1.0.0" })
 *  export class CalculatorService {
 *      ...
 *  }
 * ```
 */
export class VersioningBehavior implements ContractBehavior, EndpointBehavior, BehaviorAnnotation {

    /**
     * The name of the contract that is the target of the versioning behavior. This is required when the service has
     * more than one contract defined.
     */
    contract: string;

    /**
     * The version of the service contract in [semver](http://semver.org/) format.
     */
    version: string;

    /**
     * Constructs a VersioningBehavior object.
     * @param options Options for the behvaior.
     */
    constructor(options: VersioningOptions) {

        if(!options) {
            throw new Error("Missing required argument 'options'.");
        }

        if(!options.version) {
            throw new Error("Missing required argument 'options.version'.");
        }

        this.version = options.version;
        this.contract = options.contract;
    }

    applyContractBehavior (description: ContractDescription, endpoint: DispatchEndpoint): void {

        endpoint.filter = new VersionMessageFilter(this.version).and(endpoint.filter);
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