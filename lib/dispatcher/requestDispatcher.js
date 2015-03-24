var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events = require("events");
var Message = require("../message");
var RequestHandler = require("./requestHandler");
var HttpStatusCode = require("../httpStatusCode");
var NullLogger = require("../nullLogger");
var RequestDispatcher = (function (_super) {
    __extends(RequestDispatcher, _super);
    function RequestDispatcher() {
        _super.apply(this, arguments);
        this.closeTimeout = 30000;
        this.services = [];
        this.logger = NullLogger.instance;
        this._requestCount = 0;
    }
    /**
     * Dispatches a request.
     * @param request The request to dispatch.
     */
    RequestDispatcher.prototype.dispatch = function (request) {
        var _this = this;
        if (this._closing) {
            request.reply(Message.createReply(503 /* ServiceUnavailable */, "Service is currently unavailable."));
            return;
        }
        var endpoint = this._chooseEndpoint(request.message);
        if (!endpoint) {
            request.reply(Message.createReply(404 /* NotFound */, "Endpoint not found."));
        }
        else {
            var handler = new RequestHandler(endpoint, request);
            this._addRequest(handler);
            handler.process(function () { return _this._removeRequest(handler); });
        }
    };
    /**
     * Validates that the dispatcher is correctly configured.
     */
    RequestDispatcher.prototype.validate = function () {
        this.services.forEach(function (service) { return service.validate(); });
    };
    /**
     * Closes the dispatcher. If any requests do not complete within 'closeTimeout', they are aborted.
     * @param callback Optional. Called after dispatcher is closed.
     */
    RequestDispatcher.prototype.close = function (callback) {
        var _this = this;
        if (callback) {
            this.on('closed', callback);
        }
        if (this._closing)
            return;
        this._closing = true;
        this.emit('closing');
        this._closeTimer = setTimeout(function () {
            _this.logger.warn("Timeout of %dms exceeded while closing dispatcher.", _this.closeTimeout);
            var handler = _this._head;
            while (handler) {
                handler.abort();
                handler = handler.next;
            }
        }, this.closeTimeout);
        this._closeTimer.unref();
    };
    RequestDispatcher.prototype._chooseEndpoint = function (message) {
        var max = -Infinity, match;
        for (var i = 0; i < this.services.length; i++) {
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
    };
    RequestDispatcher.prototype._addRequest = function (handler) {
        if (this._head) {
            handler.prev = this._tail;
            this._tail = this._tail.next = handler;
        }
        else {
            this._head = this._tail = handler;
        }
        this._requestCount++;
    };
    RequestDispatcher.prototype._removeRequest = function (handler) {
        if (handler.prev) {
            handler.prev.next = handler.next;
        }
        else {
            this._head = handler.next;
        }
        if (handler.next) {
            handler.next.prev = handler.prev;
        }
        else {
            this._tail = handler.prev;
        }
        this._requestCount--;
        if (this._requestCount == 0 && this._closing) {
            clearTimeout(this._closeTimer);
            this.emit('closed');
        }
    };
    return RequestDispatcher;
})(events.EventEmitter);
module.exports = RequestDispatcher;
