/// <reference path="../typings/continuation-local-storage.d.ts" />

import cls = require("continuation-local-storage");
import RequestContext = require("./requestContext");

var ns: cls.Namespace;

class OperationContext {

    requestContext: RequestContext;

    get(name: string): any {
        return ns.get(name);
    }

    set(name: string, value: any): void {
        ns.set(name, value);
    }

    static get current(): OperationContext {

        if(!ns) return undefined;
        return ns.get("operationContext");
    }

    static create(block: (operationContext: OperationContext) => void): void {

        if(!ns) {
            ns = cls.createNamespace("__operation_context_" + (new Date().getTime().toString()) + "__");
        }

        ns.run(() => {
            var context = new OperationContext();
            ns.set('operationContext', context);
            block(context);
        });
    }
}

export = OperationContext;