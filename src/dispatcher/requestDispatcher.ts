import { EventEmitter } from "events";
import { Callback } from "../common/callback";
import { DispatchService } from "./dispatchService";
import { DispatchEndpoint } from "./dispatchEndpoint";
import { RequestContext } from "../requestContext";
import { Message } from "../message";
import { RequestHandler } from "./requestHandler";
import { HttpStatusCode } from "../httpStatusCode";
import { Logger } from "../logger";
import { NullLogger } from "../nullLogger";

export class RequestDispatcher extends EventEmitter {

    closeTimeout = 30000;
    services: DispatchService[] = [];
    logger: Logger = NullLogger.instance;

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
            request.reply(Message.createReply(HttpStatusCode.ServiceUnavailable, "Service is currently unavailable."));
            return;
        }

        var endpoint = this._chooseEndpoint(request.message);
        if(!endpoint) {
            request.reply(Message.createReply(HttpStatusCode.NotFound, "Endpoint not found."));
        }
        else {
            var handler = new RequestHandler(endpoint, request);
            this._addRequest(handler);
            handler.process(() => this._removeRequest(handler));
        }
    }

    /**
     * Validates that the dispatcher is correctly configured.
     */
    validate(): void {

        this.services.forEach(service => service.validate());
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

        if(this._requestCount == 0 && this._closing) {
            this.emit('closed');
            return;
        }

        this._closeTimer = setTimeout(() => {
            this.logger.warn("Timeout of %dms exceeded while closing dispatcher.", this.closeTimeout);
            var handler = this._head;
            while(handler) {
                handler.abort();
                handler = handler.next;
            }
        }, this.closeTimeout);
        this._closeTimer.unref();
    }

    private _chooseEndpoint(message: Message): DispatchEndpoint {

        var max = -Infinity,
            match: DispatchEndpoint;

        for(var i = 0; i < this.services.length; i++) {
            var service = this.services[i];

            for (var j = 0; j < service.endpoints.length; j++) {
                var endpoint = service.endpoints[j];

                if (endpoint.filter.match(message)) {
                    if (endpoint.filterPriority > max) {
                        max = endpoint.filterPriority;
                        match = endpoint;
                    }
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
