///<reference path="../../typings/reflect-metadata.d.ts"/>

import "reflect-metadata";
import ContractDescription = require("../description/contractDescription");
import ReflectHelper = require("../description/reflectHelper");
import Constructor = require("../common/constructor");
import VersioningBehavior = require("../behaviors/versioningBehavior");

/**
 * Adds the VersioningBehavior to the current contract.
 * @param version Contract version in semver format.
 */
function Version(version: string) {

    return function(target: Constructor) {

        var contract = ReflectHelper.retrieveContract(target);
        if(!contract) {
            throw new Error("Could not find contract on service '" + target.name + "'.");
        }

        contract.behaviors.push(new VersioningBehavior(version));
    }
}

export = Version;