/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/node-es6.d.ts" />

import * as domain from "domain";

import { RequestContext } from "./requestContext";

/**
 * The operation context.
 */
export class OperationContext {

    /**
     * Gets the RequestContext associated with the operation.
     */
    requestContext: RequestContext;

    /**
     * Dictionary of values associated with the OperationContext. Can be used to share data between functions within
     * the context of the execution of an operation.
     */
    items = new Map<string, any>();

    /**
     * Gets the OperationContext associated with the active domain. Throws an error if there is not an active domain.
     */
    static get current(): OperationContext {

        return OperationContext._activeDomain().__operation_context__;
    }

    /**
     * Sets the OperationContext associated with the active domain. Throws an error if there is not an active domain.
     * @param context The current context.
     */
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
