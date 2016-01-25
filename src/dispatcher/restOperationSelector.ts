import { OperationSelector } from "./operationSelector";
import { Message } from "../message";
import { DispatchOperation } from "./dispatchOperation";
import { DispatchEndpoint } from "./dispatchEndpoint";
import { EndpointDescription } from "../description/endpointDescription";
import {UrlTemplate} from "../urlTemplate";
import {WebInvokeAnnotation} from "../annotations";
import {Url} from "../url";

/**
 * @hidden
 */
export class RestOperationSelector implements OperationSelector {

    private _operations = new Map<string, CallableOperation[]>();

    constructor(description: EndpointDescription, endpoint: DispatchEndpoint) {

        // RestBehavior checks that the list of operations in description and endpoint matches so we don't bother
        // checking here.
        for(var i = 0; i < endpoint.operations.length; i++) {

            // check if method is annotated as callback through the REST api
            var annotation = description.contract.operations[i].method.getAnnotations(WebInvokeAnnotation)[0];
            if(annotation) {
                var list = this._operations.get(annotation.method);
                if(!list) {
                    list = [];
                    this._operations.set(annotation.method, list);
                }
                list.push({ template: annotation.template.prefix(endpoint.address), operation: endpoint.operations[i] });
            }
        }
    }

    selectOperation(message: Message): DispatchOperation {

        var list = this._operations.get(message.method);
        if(list) {
            for(var i = 0; i < list.length; i++) {
                var candidate = list[i];
                if(candidate.template.match(message.url)) {
                    return candidate.operation;
                }
            }
        }
    }
}

interface CallableOperation {

    template: UrlTemplate;
    operation: DispatchOperation;
}