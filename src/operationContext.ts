/// <reference path="./common/types.d.ts" />

import domain = require("domain");
import RequestContext = require("./requestContext");

class OperationContext {

    requestContext: RequestContext;
    items: Lookup<any> = {};

    static get current(): OperationContext {

        var active = (<any>domain).active;
        if(!active) return undefined;
        return active["__operation_context__"];
    }

    static create(block: (operationContext: OperationContext) => void): void {

        var d = domain.create();
        d.run(() => {
            var context = (<any>d)["__operation_context__"] = new OperationContext();
            block(context);
        });
    }
}

export = OperationContext;