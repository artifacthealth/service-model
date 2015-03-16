/// <reference path="./common/types.d.ts" />

import domain = require("domain");
import RequestContext = require("./requestContext");

class OperationContext {

    requestContext: RequestContext;
    private _values: Lookup<any> = {};

    get(name: string): any {
        return this._values[name];
    }

    set(name: string, value: any): void {
        this._values[name] = value;
    }

    static get current(): OperationContext {

        var active = (<any>domain).active;
        if(!active) return undefined;
        return getContext(active);
    }

    static create(block: (operationContext: OperationContext) => void): void {

        var d = domain.create();
        d.run(() => {
            block(setContext(d, new OperationContext()));
        });
    }
}

// Create a key to store the OperationContext on the Domain
var key = "__operation_context_" + (new Date().getTime().toString()) + "__";

// Generate accessor functions to allow V8 to optimize property access.
var getContext = <any>(new Function("o", "return o['" + key + "'];"));
var setContext = <any>(new Function("o", "v", "return o['" + key + "'] = v;"));


export = OperationContext;