import { ResultCallback } from "../common/resultCallback";
import { MessageFormatter } from "./messageFormatter";
import { Message } from "../message";
import { FaultError } from "../faultError";
import { OperationDescription } from "../description/operationDescription";
import { HttpStatusCode } from "../httpStatusCode";
import { UrlTemplate } from "../urlTemplate";
import { WebInvokeAnnotation, InjectBodyAnnotation } from "../annotations";
import { Parameter } from "reflect-helper";
import { Url } from "../url";
import { DispatchEndpoint } from "./dispatchEndpoint";
import { Binary } from "../binary";

/**
 * @hidden
 */
export class RestMessageFormatter implements MessageFormatter {

    private _bodyParameter: number;
    private _parameters: Parameter[];
    private _cast: ((text: string) => any)[];
    private _template: UrlTemplate;

    constructor(endpoint: DispatchEndpoint, operation: OperationDescription) {

        if(!endpoint) {
            throw new Error("Missing required argument 'endpoint'.");
        }

        if(!operation) {
            throw new Error("Missing required argument 'operation'.");
        }

        // do not include callback in list of parameters
        this._parameters = operation.method.parameters.slice(0, operation.method.parameters.length - 1);

        this._cast = new Array(this._parameters.length);

        // check parameters
        for(var i = 0; i < this._parameters.length; i++) {
            var parameter = this._parameters[i];

            if(!this._checkForInjectBody(parameter)) {

                // setup cast functions if we have a type for the parameter
                if(parameter.type) {
                    if(parameter.type.isString) {
                        this._cast[i] = castString;
                    }
                    else if(parameter.type.isNumber) {
                        this._cast[i] = parseFloat;
                    }
                    else if(parameter.type.isBoolean) {
                        this._cast[i] = castBoolean;
                    }
                    else {
                        // TODO: Handle date cast?
                        throw new Error(`Invalid parameter '${parameter.name}'. Parameters on REST enabled operations must be of type String, Number, or Boolean unless annotated with @InjectBody.`);
                    }
                }
            }
        }

        // then retrieve the url template
        var annotation = operation.method.getAnnotations(WebInvokeAnnotation)[0];
        if(annotation) {
            this._template = annotation.template.prefix(endpoint.address);
        }
    }

    /**
     * Checks to see if parameter is annotated with @Body
     * @param parameter Parameter to check.
     * @hidden
     */
    private _checkForInjectBody(parameter: Parameter): boolean {

        if(parameter.hasAnnotation(InjectBodyAnnotation)) {
            if(this._bodyParameter !== undefined) {
                throw new Error("Only one operation parameter can be decorated with @InjectBody.");
            }
            this._bodyParameter = parameter.index;
            return true;
        }
        return false;
    }

    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void {

        var args = new Array(this._parameters.length);

        if(this._template) {
            var parsed = this._template.parse(message.url);
            for(var i = 0; i < args.length; i++) {

                if(i !== this._bodyParameter) {
                    args[i] = this._cast[i](parsed.get(this._parameters[i].name));
                }
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

function castString(text: string): string {

    return text;
}

function castBoolean(text: string): boolean {

    return text === "true";
}