import {UrlTemplate} from "./urlTemplate";
/**
 * Metadata that indicates a contract implemented by a service.
 * @hidden
 */
export class ContractAnnotation {

    /**
     * Constructs a contract annotation.
     * @param name The name of the contract.
     */
    constructor(public name?: string) {

    }
}

/**
 * Options available for [[Operation]] decorator.
 */
export interface OperationOptions {
    /**
     * The name of the operation. If not specified, defaults to the name of the method.
     */
    name?: string;

    /**
     * Indicates if the operation is one way. Default is false. One-way operations immediately return to the client
     * without waiting for a result.
     */
    isOneWay?: boolean;

    /**
     * Specifies the timeout for the operation. If not specified, defaults to the timeout for the service.
     */
    timeout?: number;

    /**
     * Indicates the name of the target contract for this operation. This is required when the service has more than
     * one contract.
     */
    contract?: string;
}

/**
 * Metadata that describes a method on a service as part of a service contract.
 * @hidden
 */
export class OperationAnnotation {

    /**
     * The name of the operation. If not specified, defaults to the name of the method.
     */
    name: string;

    /**
     * Indicates if the operation is one way. Default is false. One-way operations immediately return to the client
     * without waiting for a result.
     */
    isOneWay: boolean;

    /**
     * Specifies the timeout for the operation. If not specified, defaults to the timeout for the service.
     */
    timeout: number;

    /**
     * Indicates the name of the target contract for this operation. This is required when the service has more than
     * one contract.
     */
    contract: string;

    constructor(args: OperationOptions) {

        if(args) {
            this.name = args.name;
            this.isOneWay = args.isOneWay;
            this.timeout = args.timeout;
            this.contract = args.contract;
        }
    }
}

/**
 * Options for indicating that an operation is callable via a REST api.
 */
export class WebInvokeOptions {

    /**
     * The http method (e.g. GET, POST, PUT, ...)
     */
    method: string;

    /**
     * The URL template for the operation. For more information, see [[UrlTemplate]].
     */
    template: string;
}

/**
 * Metadata that indicates an operation is callable via a REST api.
 * @hidden
 */
export class WebInvokeAnnotation {

    method: string;
    template: UrlTemplate;

    /**
     * Constructs a WebInvokeAnnotation.
     * @param options Options for operation that is callable ia a REST api.
     */
    constructor(options: WebInvokeOptions) {

        if(!options) {
            throw new Error("Missing required argument 'options'.");
        }

        if(!options.method) {
            throw new Error("Missing required argument 'options.method'.");
        }

        if(!options.template) {
            throw new Error("Missing required argument 'options.template'.");
        }

        this.method = options.method.toUpperCase();
        this.template = new UrlTemplate(options.template);
    }
}

/**
 * Metadata that indicates an operation is callable an HTTP GET request.
 * @hidden
 */
export class WebGetAnnotation extends WebInvokeAnnotation {

    /**
     * Constructs a WebGetAnnotation.
     * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
     */
    constructor(template: string) {
        super({ method: "GET", template: template });
    }
}

/**
 * Metadata that indicates an operation is callable an HTTP PUT request.
 * @hidden
 */
export class WebPutAnnotation extends WebInvokeAnnotation {

    /**
     * Constructs a WebPutAnnotation.
     * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
     */
    constructor(template: string) {
        super({ method: "PUT", template: template });
    }

}

/**
 * Metadata that indicates an operation is callable an HTTP POST request.
 * @hidden
 */

export class WebPostAnnotation extends WebInvokeAnnotation {

    /**
     * Constructs a WebPostAnnotation.
     * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
     */
    constructor(template: string) {
        super({ method: "POST", template: template });
    }
}

/**
 * Metadata that indicates an operation is callable an HTTP DELETE request.
 * @hidden
 */

export class WebDeleteAnnotation extends  WebInvokeAnnotation {

    /**
     * Constructs a WebDeleteAnnotation.
     * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
     */
    constructor(template: string) {
        super({ method: "DELETE", template: template });
    }
}

/**
 * Metadata that indicates an operation is callable an HTTP HEAD request.
 * @hidden
 */
export class WebHeadAnnotation extends WebInvokeAnnotation {

    /**
     * Constructs a WebHeadAnnotation.
     * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
     */
    constructor(template: string) {
        super({ method: "HEAD", template: template });
    }
}

/**
 * Metadata indicates that the body of the message should be mapped to the operation parameter.
 * @hidden
 */
export class InjectBodyAnnotation {

}