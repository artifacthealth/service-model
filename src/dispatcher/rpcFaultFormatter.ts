import FaultFormatter = require("./faultFormatter");
import Message = require("../message");
import FaultError = require("../faultError");

class RpcFaultFormatter implements FaultFormatter {

    serializeFault(fault: FaultError, callback: ResultCallback<Message>): void {

        var body: any = {
            message: fault.message
        }

        if(fault.code) {
            body.code = fault.code;
        }

        if(fault.detail != null) {
            body.detail = fault.detail;
        }

        var message = new Message({ fault: body });
        message.statusCode = fault.statusCode;

        callback(null, message);
    }
}

export = RpcFaultFormatter;