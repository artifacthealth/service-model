/// <reference path="../common/types.d.ts" />

import Fault = require("../fault");

interface ErrorHandler {

    /**
     * Converts an Error into a Fault.
     * @param err The error.
     * @param callback Called with the Fault.
     */
    provideFault?(err: Error): Fault;

    /**
     * Handles an error. Async actions can be performed. However, the dispatcher will not wait for completion
     * of the handler to move on to the next request.
     * @param err The error.
     */
    handleError?(err: Error): void;
}

export = ErrorHandler;