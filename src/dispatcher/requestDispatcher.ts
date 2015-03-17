/// <reference path="../common/types.d.ts" />

import DispatchService = require("./dispatchService");
import RequestContext = require("../requestContext");
import Message = require("../message");
import RequestHandler = require("./requestHandler");
import RequestQueue = require("./requestQueue");
import HttpStatusCode = require("../httpStatusCode");

class RequestDispatcher {

    services: DispatchService[] = [];

    maxConcurrentCalls = 16;

    dispatch(request: RequestContext): boolean {

        // TODO: error if we can't find the service?
        var service = this.chooseService(request.message);
        if(!service) {
            return false
        }

        var endpoint = service.chooseEndpoint(request.message);
        if(!endpoint) {
            request.reply(Message.create(HttpStatusCode.NotFound));
        }
        else {
            new RequestHandler(endpoint, request).process();
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
