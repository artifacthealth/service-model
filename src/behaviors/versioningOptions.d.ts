/**
 * Options provided to the [[VersioningBehavior]].
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