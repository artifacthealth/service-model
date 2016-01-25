import { ResultCallback } from "../common/resultCallback";
import { MessageFormatter } from "./messageFormatter";
import { Message } from "../message";
import { FaultError } from "../faultError";
import { OperationDescription } from "../description/operationDescription";
import { HttpStatusCode } from "../httpStatusCode";
import { UrlTemplate } from "../urlTemplate";
import { WebInvokeAnnotation, BodyAnnotation } from "../annotations";
import { Parameter } from "reflect-helper";

/**
 * @hidden
 */
export class RestMessageFormatter implements MessageFormatter {

    private _bodyParameter: number;
    private _parameterNames: string[];
    private _template: UrlTemplate;

    constructor(operation: OperationDescription) {

        if(!operation) {
            throw new Error("Missing required argument 'operation'.");
        }

        var parameters = operation.method.parameters || [];
        // do not include callback in parameter count
        var count = parameters.length - 1;

        this._parameterNames = new Array(count);
        for(var i = 0; i < count; i++) {

            this._parameterNames[i] = parameters[i].name;
            this._checkForInjectBody(parameters[i]);
        }

        var annotation = operation.method.getAnnotations(WebInvokeAnnotation)[0];
        if(annotation) {
            this._template = annotation.template;
        }
    }

    private _checkForInjectBody(parameter: Parameter): void {

        var annotation = parameter.getAnnotations(BodyAnnotation)[0];
        if(annotation) {
            if(this._bodyParameter !== undefined) {
                throw new Error("Only one operation parameter can be decorated with @Body");
            }
            this._bodyParameter = parameter.index;
        }
    }

    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void {

        var args = new Array(this._parameterNames.length);

        if(this._template) {
            var parsed = this._template.parse(message.url);
            for(var i = 0; i < args.length; i++) {
                args[i] = parsed.get(this._parameterNames[i]);
            }
        }

        if(this._bodyParameter !== undefined) {
            args[this._bodyParameter] = message.body;
        }

        callback(null, args);
    }

    serializeReply(result: any, callback: ResultCallback<Message>): void {

        callback(null, Message.createReply(HttpStatusCode.Ok, result));
    }

}
