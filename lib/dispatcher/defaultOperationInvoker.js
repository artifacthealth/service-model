var FaultError = require("../faultError");
var DefaultOperationInvoker = (function () {
    function DefaultOperationInvoker(description) {
        if (!description) {
            throw new Error("Missing required argument 'operationDescription'.");
        }
        this._method = description.method;
        this._parameterCount = description.method.getType().getCallSignatures()[0].getParameters().length;
        if (description.isAsync) {
            // do not include callback in parameter count if async
            this._parameterCount--;
        }
        this._isAsync = description.isAsync;
    }
    DefaultOperationInvoker.prototype.invoke = function (instance, args, callback) {
        var _this = this;
        if (!instance) {
            throw new Error("Missing required argument 'instance'.");
        }
        if (!args) {
            throw new Error("Missing required argument 'args'.");
        }
        if (args.length != this._parameterCount) {
            process.nextTick(function () { return callback(new Error("Wrong number of arguments for operation.")); });
            return;
        }
        // TODO: get rid of support of sync functions?
        // synchronous invoke
        if (!this._isAsync) {
            try {
                var result = this._method.invoke(instance, args);
                process.nextTick(function () { return callback(null, result); });
            }
            catch (err) {
                // If it's a FaultError then pass the error to the callback for further processing; otherwise, rethrow
                // the  error.
                if (FaultError.isFaultError(err)) {
                    process.nextTick(function () { return callback(err); });
                }
                else {
                    throw err;
                }
            }
            return;
        }
        // asynchronous invoke
        var timeout = false, finished = false;
        var timeoutHandle = setTimeout(function () {
            if (finished)
                return;
            timeout = true;
            callback(new Error("Timeout of " + _this.timeout + "ms exceeded while invoking operation."));
        }, this.timeout || 10000);
        var done = function (err, result) {
            if (timeout)
                return;
            clearTimeout(timeoutHandle);
            if (finished) {
                throw new Error("Callback already called.");
            }
            finished = true;
            callback(err, result);
        };
        this._method.invoke(instance, args.concat(done));
    };
    return DefaultOperationInvoker;
})();
module.exports = DefaultOperationInvoker;
