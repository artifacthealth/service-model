/// <reference path="./common/types.d.ts" />

import domain = require("domain");
import RequestContext = require("./requestContext");

var key = "__operation_context_" + (new Date().getTime().toString()) + "__";

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
        return active[key];
    }

    static create(block: (operationContext: OperationContext) => void): void {

        var d = domain.create();

        d.run(() => {
            block((<any>d)[key] = new OperationContext());
        });
    }
}

export = OperationContext;