/// <reference path="../common/types.d.ts" />

import RequestHandler = require("./requestHandler");
import RequestDispatcher = require("./requestDispatcher");

class RequestQueue {

    private _head: RequestHandler;
    private _tail: RequestHandler;
    private _dispatcher: RequestDispatcher;
    private _running = 0;

    constructor(dispatcher: RequestDispatcher) {
        this._dispatcher = dispatcher;
    }

    add(request: RequestHandler): void {

        if(this._head) {
            // add request to the end of the queue
            this._tail = this._tail.next = request;
        }
        else {
            // this is the first request so initialize the queue and start processing
            this._head = this._tail = request;
            process.nextTick(() => this._process());
        }
    }

    private _process(): void {

        var request = this._head;
        while(request) {
            if(this._running + 1 > this._dispatcher.maxConcurrentCalls) break;

            this._head = this._head.next;
            this._running++;
            request.process(this._finished(request));
            request = this._head;
        }
    }

    private _finished(request: RequestHandler): Callback {

        return (err: Error) => {
            // TODO: What to do on error? The only situation where an error would occur is if serializing a fault fails.
            if(err) throw err;

            if(request.finished) {
                throw new Error("Callback for request can only be called once.");
            }

            request.finished = true;
            this._running--;

            if(this._head) {
                this._process();
            }
        }
    }
}

export = RequestQueue;