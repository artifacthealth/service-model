import MessageFormatter = require("./messageFormatter");
import Message = require("../message");
import FaultError = require("../faultError");
import OperationDescription = require("../description/operationDescription");

class RpcMessageFormatter implements MessageFormatter {

    private _operation: OperationDescription;

    constructor(operation: OperationDescription) {

        if(!operation) {
            throw new Error("Missing required argument 'operation'.");
        }

        this._operation = operation;
    }

    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void {

        var keys = Object.keys(message.body);
        if(keys.length != 1) {
            return callback(new Error("Bad request format. Expected exactly one root node."));
        }

        callback(null, message.body[keys[0]]);
    }

    serializeReply(result: any, callback: ResultCallback<Message>): void {

        callback(null, new Message({ response: result }));
    }

    serializeFault(fault: FaultError, callback: ResultCallback<Message>): void {

        var body: any = {
            message: fault.message
        }

        if(fault.code) {
            body.code = fault.code;
        }

        if(fault.detail) {
            body.detail = fault.detail;
        }

        callback(null, new Message({ fault: body }));
    }
}

export = RpcMessageFormatter;