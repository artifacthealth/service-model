/// <reference path="../common/types.d.ts" />

import DispatchService = require("./dispatchService");
import RequestContext = require("../requestContext");
import Message = require("../message");
import RequestHandler = require("./requestHandler");
import RequestQueue = require("./requestQueue");
import HttpStatusCode = require("../httpStatusCode");

class RequestDispatcher {

    services: DispatchService[] = [];

    /**
     * Maximum number of concurrent operations. If the number is exceeded, any additional operations are queued.
     */
    maxConcurrentCalls = 16;

    _queue: RequestQueue;

    constructor() {
        this._queue = new RequestQueue(this);
    }

    dispatch(request: RequestContext): boolean {

        // TODO: once we've gone through the trouble of creating the request object, shouldn't we throw an errorif we can't find the service?

        var service = this.chooseService(request.message);
        if(!service) {
            return false
        }

        var endpoint = service.chooseEndpoint(request.message);
        if(!endpoint) {
            request.reply(Message.create(HttpStatusCode.NotFound));
        }
        else {
            this._queue.add(new RequestHandler(endpoint, request));
        }

        return true;
    }

    chooseService(message: Message): DispatchService {

        var max = -Infinity,
            match: DispatchService;

        for(var i = 0; i < this.services.length; i++) {
            var service = this.services[i];
            if(service.filter.match(message)) {
                if(service.filterPriority > max) {
                    max = service.filterPriority;
                    match = service;
                }
            }
        }

        return match;
    }
}

export = RequestDispatcher;
