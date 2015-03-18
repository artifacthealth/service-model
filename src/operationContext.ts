/// <reference path="./common/types.d.ts" />

import domain = require("domain");
import RequestContext = require("./requestContext");

class OperationContext {

    requestContext: RequestContext;
    items: Lookup<any> = {};

    static get current(): OperationContext {

        return OperationContext._activeDomain().__operation_context__;
    }


    static set current(context: OperationContext) {

        OperationContext._activeDomain().__operation_context__ = context;
    }

    private static _activeDomain(): any {

        var active = (<any>domain).active;
        if(!active) {
            throw new Error("There is not an active domain.");
        }
        return active;
    }
}

export = OperationContext;