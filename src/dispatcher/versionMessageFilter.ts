/// <reference path="../../typings/semver.d.ts" />

import semver = require("semver");

import Lookup = require("../common/lookup");
import MessageFilter = require("./messageFilter");
import Message = require("../message");

class VersionMessageFilter extends MessageFilter {

    private _version: string;
    private _cache: Lookup<boolean> = {};

    constructor(version: string) {
        super();

        if(!version) {
            throw new Error("Missing required argument 'version'.");
        }

        this._version = version;
    }

    match(message: Message): boolean {
        var acceptVersion = message.headers["Accept-Version"];
        if(!acceptVersion) return true;

        var satisfies = this._cache[acceptVersion];
        if(satisfies === undefined) {
            satisfies = this._cache[acceptVersion] = semver.satisfies(this._version, acceptVersion);
        }

        return satisfies;
    }
}

export = VersionMessageFilter;