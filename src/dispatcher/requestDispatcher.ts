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

/**
 * Responsible for dispatching service requests.
 *
 * ### Events
 * * `closing` - Triggered when [[close]] is called on the RequestDispatcher. This event indicates that the dispatcher is
 * no longer accepting new requests.
 * * `closed` - Triggered after the RequestedDispatched closes. This event indicates that all pending requests have
 * completed or timed out.
 * * `error` - Trigger if an unhandled exception is raised in an operation. This event is only relevant if an
 * [[OperationContext]] is created.
 */
export class RequestDispatcher extends EventEmitter {

    /**
     * Timeout in milliseconds for close operation to complete after requested. Any requests that have completed before
     * the timeout are aborted.
     */
    closeTimeout = 30000;

    /**
     * List of services in the dispatcher.
     */
    services: DispatchService[] = [];

    /**
     * Logger to use that conforms to [bunyan](https://www.npmjs.com/package/bunyan)'s logger interface.
     */
    logger: Logger = NullLogger.instance;

    /**
     * @hidden
     */
    private _head: RequestHandler;
    /**
     * @hidden
     */
    private _tail: RequestHandler;
    /**
     * @hidden
     */
    private _requestCount = 0;
    /**
     * @hidden
     */
    private _closing: boolean;
    /**
     * @hidden
     */
    private _closed: boolean;
    /**
     * @hidden
     */
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
            if(this._closed) {
                callback();
                return;
            }

            this.on('closed', callback);
        }

        if(this._closing) return;
        this._closing = true;

        this.emit('closing');

        // if there are not any pending requests when close is called then close immediately.
        if(this._requestCount == 0 && this._closing) {
            this._closed = true;
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

    /**
     * Chooses the appropriate endpoint for the request.
     * @param message The request message.
     * @hidden
     */
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

    /**
     * Adds a request to the list of pending requests.
     * @param handler The request handler.
     * @hidden
     */
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

    /**
     * Removes a request from the list of pending requests.
     * @param handler The request handler.
     * @hidden
     */
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
