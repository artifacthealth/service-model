import MessageFormatter = require("./messageFormatter");
import Message = require("../message");
import FaultError = require("../faultError");
import OperationDescription = require("../description/operationDescription");
import HttpStatusCode = require("../httpStatusCode");

class RpcMessageFormatter implements MessageFormatter {

    private _operationName: string;
    private _parameterNames: string[];

    constructor(operation: OperationDescription) {

        if(!operation) {
            throw new Error("Missing required argument 'operation'.");
        }

        this._operationName = operation.name;

        var parameters = operation.method.getType().getCallSignatures()[0].getParameters();
        var count = parameters.length;
        if(operation.isAsync) {
            // do not include callback in parameter count if async
            count--;
        }

        this._parameterNames = new Array(count);
        for(var i = 0; i < count; i++) {
            this._parameterNames[i] = parameters[i].getName();
        }
    }

    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void {

        var args = message.body[this._operationName];
        if(args == null) {
            return callback(new Error("Missing root element '" + this._operationName + "'."));
        }

        if(Array.isArray(args)) {
            if(args.length != this._parameterNames.length) {
                return callback(new Error("Wrong number of arguments."));
            }
        }
        else {
            var obj = args;
            args = new Array(this._parameterNames.length);
            for(var i = 0; i < this._parameterNames.length; i++) {
                args[i] = obj[this._parameterNames[i]];
            }
        }

        callback(null, args);
    }

    serializeReply(result: any, callback: ResultCallback<Message>): void {

        callback(null, Message.createReply(HttpStatusCode.Ok, { response: result }));
    }

}

export = RpcMessageFormatter;