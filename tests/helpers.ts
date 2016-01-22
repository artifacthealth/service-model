import {EndpointDescription} from "../src/description/endpointDescription";
import {OperationDescription} from "../src/description/operationDescription";

export function hasOperation(endpoint: EndpointDescription, operation: string): boolean {

    return !!getOperation(endpoint, operation);
}

export function getOperation(endpoint: EndpointDescription, operation: string): OperationDescription {

    for(var i = 0; i < endpoint.contract.operations.length; i++) {
        if(endpoint.contract.operations[i].name == operation) {
            return endpoint.contract.operations[i];
        }
    }
}