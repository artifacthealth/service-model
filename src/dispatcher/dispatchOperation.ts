import {DispatchEndpoint} from "./dispatchEndpoint";
import {OperationDescription} from "../description/operationDescription";
import {DefaultOperationInvoker} from "./defaultOperationInvoker";
import {ResultCallback} from "../common/callbackUtil";
import {Message} from "../message";

/**
 * Represents an operation on a service endpoint in the dispatcher. Exposes configuration options for the operation.
 *
 * <uml>
 *  hide members
 *  hide circle
 *  DispatchEndpoint *-- DispatchOperation : operations
 *  DispatchOperation *-- OperationInvoker : invoker
 *  DispatchOperation *-- MessageFormatter : formatter
 * </uml>
 */
export class DispatchOperation {

    /**
     * The name of the operation.
     */
    name: string;

    /**
     * The formatter for the operation, responsible for serializing and deserailizing requests.
     */
    formatter: MessageFormatter;

    /**
     * The object responsible for invoking the service method.
     */
    invoker: OperationInvoker;

    /**
     * Indicates if the operation is one way. If true the dispatcher does not wait for the operation to complete before
     * sending a response to the client.
     */
    isOneWay: boolean;

    /**
     * Constructs a dispatch operation.
     * @param endpoint The endpoint.
     * @param name The name of the operation.
     */
    constructor(public endpoint: DispatchEndpoint, name: string) {

        if(!endpoint) {
            throw new Error("Missing required parameter 'endpoint'.");
        }

        if(!name) {
            throw new Error("Missing required parameter 'name'.");
        }

        this.name = name;
    }

    /**
     * Validates that the operation is correctly configured.
     */
    validate(): void {

        if(!this.formatter) {
            this._throwConfigError("Undefined 'formatter'.");
        }

        if(!this.invoker) {
            this._throwConfigError("Undefined 'invoker'.");
        }
    }

    /**
     * Throws a configuration error.
     * @param message A message to display
     * @hidden
     */
    private _throwConfigError(message: string): void {

        throw new Error("Operation '" + this.name + "' on service '" + this.endpoint.service.name + "' incorrectly configured. " + message);
    }
}


/**
 * Describes a type that can invoker service methods.
 */
export interface OperationInvoker {

    /**
     * Invokes a service method on the given service instance.
     * @param instance The service instance.
     * @param args A list of arguments applied to the method.
     * @param callback Called with result of the operation.
     */
    invoke(instance: Object, args: any[], callback: ResultCallback<any>):  void;
}

/**
 * Represents a type that is able to deserialize requests and serialize replies.
 */
export interface MessageFormatter {

    /**
     * Deserialize a request message.
     * @param message The request message.
     * @param callback Called with a list of arguments that will be applied to the operation.
     */
    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void;

    /**
     * Serializes a reply message.
     * @param result The result from the operation.
     * @param callback Called with the reply message.
     */
    serializeReply(result: any, callback: ResultCallback<Message>): void;
}
