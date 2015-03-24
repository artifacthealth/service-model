var Message = require("../message");
var RpcFaultFormatter = (function () {
    function RpcFaultFormatter() {
    }
    RpcFaultFormatter.prototype.serializeFault = function (fault, callback) {
        var body = {
            message: fault.message
        };
        if (fault.code) {
            body.code = fault.code;
        }
        if (fault.detail != null) {
            body.detail = fault.detail;
        }
        var message = new Message({ fault: body });
        message.statusCode = fault.statusCode;
        callback(null, message);
    };
    return RpcFaultFormatter;
})();
module.exports = RpcFaultFormatter;
