/// <reference path="../common/types.d.ts" />

import events = require("events");

import DispatchService = require("./dispatchService");
import RequestContext = require("../requestContext");
import Message = require("../message");
import RequestHandler = require("./requestHandler");
import HttpStatusCode = require("../httpStatusCode");

class RequestDispatcher extends events.EventEmitter {

    closeTimeout = 30000;
    services: DispatchService[] = [];

    private _head: RequestHandler;
    private _tail: RequestHandler;
    private _requestCount = 0;
    private _closing: boolean;
    private _closeTimer: NodeJS.Timer;

    /**
     * Dispatches a request.
     * @param request The request to dispatch.
     */
    dispatch(request: RequestContext): void {
        if(this._closing) {
            request.reply(Message.create(HttpStatusCode.ServiceUnavailable));
            return;
        }

        var service = this._chooseService(request.message);
        if(service) {
            var endpoint = service.chooseEndpoint(request.message);
        }

        if(!endpoint) {
            request.reply(Message.create(HttpStatusCode.NotFound));
        }
        else {
            var handler = new RequestHandler(endpoint, request);
            this._addRequest(handler);
            handler.process(() => this._removeRequest(handler));
        }
    }

    /**
     * Closes the dispatcher. If any requests do not complete within 'closeTimeout', they are aborted.
     * @param callback Optional. Called after dispatcher is closed.
     */
    close(callback?: Callback): void {

        if(callback) {
            this.on('closed', callback);
        }

        if(this._closing) return;
        this._closing = true;

        this.emit('closing');

        this._closeTimer = setTimeout(() => {
            // TODO: use logger
            console.log("Timeout of " + this.closeTimeout + "ms exceeded while closing dispatcher.");
            var handler = this._head;
            while(handler) {
                handler.abort();
                handler = handler.next;
            }
        }, this.closeTimeout);
        this._closeTimer.unref();
    }

    private _chooseService(message: Message): DispatchService {

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

    private _addRequest(handler: RequestHandler): void {

        if(this._head) {
            handler.prev = this._tail;
            this._tail = this._tail.next = handler;
        }
        else {
            this._head = this._tail = handler;
        }
        this._requestCount++;
    }

    private _removeRequest(handler: RequestHandler): void {

        if(handler.prev) {
            handler.prev.next = handler.next;
        }
        else {
            this._head = handler.next;
        }

        if(handler.next) {
            handler.next.prev = handler.prev;
        }
        else {
            this._tail = handler.prev;
        }

        this._requestCount--;
        if(this._requestCount == 0 && this._closing) {
            clearTimeout(this._closeTimer);
            this.emit('closed');
        }
    }
}

export = RequestDispatcher;
