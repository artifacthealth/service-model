import { ResultCallback } from "../common/resultCallback";
import { MessageFormatter } from "./messageFormatter";
import { Message } from "../message";
import { FaultError } from "../faultError";
import { OperationDescription } from "../description/operationDescription";
import { HttpStatusCode } from "../httpStatusCode";

export class RpcMessageFormatter implements MessageFormatter {

    private _operationName: string;
    private _parameterNames: string[];

    constructor(operation: OperationDescription) {

        if(!operation) {
            throw new Error("Missing required argument 'operation'.");
        }

        this._operationName = operation.name;

        var parameters = operation.method.parameters || [];
        // do not include callback in parameter count
        var count = parameters.length - 1;

        this._parameterNames = new Array(count);
        for(var i = 0; i < count; i++) {
            this._parameterNames[i] = parameters[i].name;
        }
    }

    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void {

        var args = message.body[this._operationName];
        if(args == null) {
            callback(new Error("Missing root element '" + this._operationName + "'."));
            return;
        }

        if(Array.isArray(args)) {
            if(args.length != this._parameterNames.length) {
                callback(new Error("Wrong number of arguments."));
                return;
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
