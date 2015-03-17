/// <reference path="../../typings/semver.d.ts" />

import semver = require("semver");

import MessageFilter = require("./messageFilter");
import Message = require("../message");
import Url = require("../url");

class VersionMessageFilter extends MessageFilter {

    private _version: string;

    constructor(version: string) {
        super();

        if(!version) {
            throw new Error("Missing required argument 'version'.");
        }

        this._version = version;
    }

    match(message: Message): boolean {

        var acceptVersion = message.getHeader("Accept-Version");
        return !acceptVersion || semver.satisfies(this._version, acceptVersion);
    }
}

export = VersionMessageFilter;