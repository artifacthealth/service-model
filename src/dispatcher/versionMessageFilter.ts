import { satisfies as satisfiesSemver } from "semver";
import { MessageFilter } from "./messageFilter";
import { Message } from "../message";

/**
 * @hidden
 */
export class VersionMessageFilter extends MessageFilter {

    private _version: string;
    private _cache = new Map<string, boolean>();

    constructor(version: string) {
        super();

        if(!version) {
            throw new Error("Missing required argument 'version'.");
        }

        this._version = version;
    }

    match(message: Message): boolean {
        var acceptVersion = message.headers.get("Accept-Version");
        if(!acceptVersion) return true;

        var satisfies = this._cache.get(acceptVersion);
        if(satisfies === undefined) {
            satisfies = satisfiesSemver(this._version, acceptVersion);
            this._cache.set(acceptVersion, satisfies);
        }

        return satisfies;
    }
}
