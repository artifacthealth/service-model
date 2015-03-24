var Message = require("../message");
var HttpStatusCode = require("../httpStatusCode");
var RpcMessageFormatter = (function () {
    function RpcMessageFormatter(operation) {
        if (!operation) {
            throw new Error("Missing required argument 'operation'.");
        }
        this._operationName = operation.name;
        var parameters = operation.method.getType().getCallSignatures()[0].getParameters();
        var count = parameters.length;
        if (operation.isAsync) {
            // do not include callback in parameter count if async
            count--;
        }
        this._parameterNames = new Array(count);
        for (var i = 0; i < count; i++) {
            this._parameterNames[i] = parameters[i].getName();
        }
    }
    RpcMessageFormatter.prototype.deserializeRequest = function (message, callback) {
        var args = message.body[this._operationName];
        if (args == null) {
            return callback(new Error("Missing root element '" + this._operationName + "'."));
        }
        if (Array.isArray(args)) {
            if (args.length != this._parameterNames.length) {
                return callback(new Error("Wrong number of arguments."));
            }
        }
        else {
            var obj = args;
            args = new Array(this._parameterNames.length);
            for (var i = 0; i < this._parameterNames.length; i++) {
                args[i] = obj[this._parameterNames[i]];
            }
        }
        callback(null, args);
    };
    RpcMessageFormatter.prototype.serializeReply = function (result, callback) {
        callback(null, Message.createReply(200 /* Ok */, { response: result }));
    };
    return RpcMessageFormatter;
})();
module.exports = RpcMessageFormatter;
