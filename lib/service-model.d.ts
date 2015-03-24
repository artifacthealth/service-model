/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/tsreflect.d.ts" />

declare module "service-model" {
    import reflect = require("tsreflect");
    import events = require("events");

    export class FaultError extends HttpError {
        /**
         * The name of the error.
         */
        name: string;
        /**
         * Application specific machine readable code identifying the fault.
         */
        code: string;
        /**
         * Application specific information about the fault that is passed to the client.
         */
        detail: any;
        constructor(detail?: any, message?: string, code?: string, statusCode?: HttpStatusCode);
        /**
         * Returns true if the error is a FaultError; otherwise, returns false.
         * @param err The error.
         */
        static isFaultError(err: Error): boolean;
    }

    export class DispatcherFactory {
        addService(ctr: Constructor, name?: string): ServiceDescription;
        registerBehavior(annotationName: string, behavior: Constructor): void;
        createDispatcher(): RequestDispatcher;
    }

    /**
     * A logger.
     */
    export interface Logger {
        /**
         * Creates a child logger with the given options.
         * @param options Logger options.
         */
        child(options: LoggerOptions): Logger;
        /**
         * Creates a log record with the TRACE log level.
         * @param error The error to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        trace(error: Error, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the TRACE log level.
         * @param fields Set of additional fields to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        trace(fields: Object, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the TRACE log level.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        trace(msg: string, ...params: any[]): void;
        /**
         * Creates a log record with the DEBUG log level.
         * @param error The error to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        debug(error: Error, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the DEBUG log level.
         * @param fields Set of additional fields to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        debug(fields: Object, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the DEBUG log level.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        debug(msg: string, ...args: any[]): void;
        /**
         * Creates a log record with the INFO log level.
         * @param error The error to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        info(error: Error, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the INFO log level.
         * @param fields Set of additional fields to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        info(fields: Object, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the INFO log level.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        info(msg: string, ...args: any[]): void;
        /**
         * Creates a log record with the WARN log level.
         * @param error The error to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        warn(error: Error, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the WARN log level.
         * @param fields Set of additional fields to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        warn(fields: Object, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the WARN log level.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        warn(msg: string, ...args: any[]): void;
        /**
         * Creates a log record with the ERROR log level.
         * @param error The error to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        error(error: Error, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the ERROR log level.
         * @param fields Set of additional fields to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        error(fields: Object, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the ERROR log level.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        error(msg: string, ...args: any[]): void;
        /**
         * Creates a log record with the FATAL log level.
         * @param error The error to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        fatal(error: Error, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the FATAL log level.
         * @param fields Set of additional fields to log.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        fatal(fields: Object, msg?: string, ...args: any[]): void;
        /**
         * Creates a log record with the FATAL log level.
         * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
         */
        fatal(msg: string, ...args: any[]): void;
    }

    /**
     * The operation context.
     */
    export class OperationContext {
        /**
         * Gets the RequestContext associated with the operation.
         */
        requestContext: RequestContext;
        /**
         * Dictionary of values associated with the OperationContext. Can be used to share data between functions within
         * the context of the execution of an operation.
         */
        items: Lookup<any>;
        /**
         * Gets the OperationContext associated with the active domain. Throws an error if there is not an active domain.
         */
        /**
         * Sets the OperationContext associated with the active domain. Throws an error if there is not an active domain.
         * @param context The current context.
         */
        static current: OperationContext;
    }

    export class Message {
        url: Url;
        statusCode: HttpStatusCode;
        method: string;
        headers: Lookup<string>;
        body: any;
        constructor(body?: any);
        static createReply(status: HttpStatusCode, body?: any): Message;
    }

    export class Url {
        protocol: string;
        hostname: string;
        port: string;
        pathname: string;
        query: string;
        hash: string;
        constructor(address?: Url | string);
        resolve(address: Url | string): Url;
        equals(other: Url): boolean;
        clone(): Url;
        toString(): string;
        static normalize(path: string): string;
    }

    export interface RequestContext {
        message: Message;
        abort(): void;
        reply(message?: Message): void;
    }

    export enum HttpStatusCode {
        Continue = 100,
        SwitchingProtocols = 101,
        Ok = 200,
        Created = 201,
        Accepted = 202,
        NonAuthoritativeInformation = 203,
        NoContent = 204,
        ResetContent = 205,
        PartialContent = 206,
        MultipleChoices = 300,
        MovedPermanently = 301,
        Found = 302,
        SeeOther = 303,
        NotModified = 304,
        UseProxy = 305,
        TemporaryRedirect = 307,
        BadRequest = 400,
        Unauthorized = 401,
        PaymentRequired = 402,
        Forbidden = 403,
        NotFound = 404,
        MethodNotAllowed = 405,
        NotAcceptable = 406,
        ProxyAuthenticationRequired = 407,
        RequestTimeout = 408,
        Conflict = 409,
        Gone = 410,
        LengthRequired = 411,
        PreconditionFailed = 412,
        RequestEntityTooLarge = 413,
        RequestURITooLong = 414,
        UnsupportedMediaType = 415,
        RequestRangeNotSatisfiable = 416,
        ExpectationFailed = 417,
        TooManyRequests = 429,
        InternalServerError = 500,
        NotImplemented = 501,
        BadGateway = 502,
        ServiceUnavailable = 503,
        GatewayTimeout = 504,
        HttpVersionNotSupported = 505,
    }

    export interface ContractBehavior {
        applyContractBehavior (description: ContractDescription, endpoint: DispatchEndpoint): void;
    }

    export interface EndpointBehavior {
        applyEndpointBehavior (description: EndpointDescription, endpoint: DispatchEndpoint): void;
    }

    export class EndpointDescription {
        behaviors: EndpointBehavior[];
        contract: ContractDescription;
        address: Url;
        constructor(contract: ContractDescription, address: Url | string);
    }

    export class ContractDescription {
        name: string;
        behaviors: ContractBehavior[];
        operations: OperationDescription[];
        contractType: reflect.Type;
        version: string;
        constructor(contractType: reflect.Type, name?: string);
    }

    export interface OperationBehavior {
        applyOperationBehavior (description: OperationDescription, operation: DispatchOperation): void;
    }

    export class OperationDescription {
        contract: ContractDescription;
        name: string;
        behaviors: OperationBehavior[];
        method: reflect.Symbol;
        returnType: reflect.Type;
        isOneWay: boolean;
        isAsync: boolean;
        constructor(contract: ContractDescription, method: reflect.Symbol, name?: string);
    }

    export interface ServiceBehavior {
        applyServiceBehavior (description: ServiceDescription, service: DispatchService): void;
    }

    export class ServiceDescription {
        name: string;
        behaviors: ServiceBehavior[];
        endpoints: EndpointDescription[];
        serviceSymbol: reflect.Symbol;
        constructor(serviceSymbol: reflect.Symbol, name?: string);
        addEndpoint(implementedContract: string, address: Url | string, behaviors?: EndpointBehavior | EndpointBehavior[]): EndpointDescription;
    }

    export interface ErrorHandler {
        /**
         * Handles an error. Note that next must be called with the error that is being handled.
         * @param err The error.
         * @param request The request context.
         * @param next Callback to call the next error handled.
         */
        handleError(err: Error, request: RequestContext, next: Callback): void;
    }

    export interface FaultFormatter {
        serializeFault(fault: FaultError, callback: ResultCallback<Message>): void;
    }

    export interface InstanceProvider {
        getInstance(message: Message): Object;
    }

    /**
     * Base class for classes used to filter messages. Not intended to be instantiated directly.
     */
    export class MessageFilter {
        /**
         * When overridden in a derived class, tests whether or not the message satisfies the criteria of the filter.
         * @param message The message to match.
         */
        match(message: Message): boolean;
        /**
         * Returns a new filter that is the logical AND of the current filter and the 'other' filter.
         * @param other The filter to combine with the current filter.
         */
        and(other: MessageFilter): MessageFilter;
        /**
         * Returns a new filter that is the logical OR of the current filter and the 'other' filter.
         * @param other The filter to combine with the current filter.
         */
        or(other: MessageFilter): MessageFilter;
        /**
         * Returns a new filter that is the logical NOT of the current filter.
         */
        not(): MessageFilter;
    }

    export interface MessageFormatter {
        deserializeRequest(message: Message, callback: ResultCallback<any[]>): void;
        serializeReply(result: any, callback: ResultCallback<Message>): void;
    }

    export interface MessageInspector {
        /**
         * Called after a message has been received but before it has been dispatched. Returns a value that is passed
         * to beforeSendReply.
         * @param request The request message.
         */
        afterReceiveRequest(request: Message): any;
        /**
         * Called after the operation has returned but before the reply message is sent.
         * @param reply The reply message.
         * @param state The value returned from afterReceiveRequest.
         */
        beforeSendReply(reply: Message, state: any): void;
    }

    export interface OperationInvoker {
        invoke(instance: Object, args: any[], callback: ResultCallback<any>):  void;
    }

    export interface OperationSelector {
        selectOperation(message: Message): DispatchOperation;
    }

    /**
     * A message filter that filters messages based on the message url path. The message is considered a match
     * if the path in the url of the message is exactly the same as the path in the url of the filter.
     */
    export class AddressMessageFilter extends MessageFilter {
        /**
         * Constructs an AddressMessageFilter object.
         * @param url The url to match.
         */
        constructor(url: Url);
        /**
         * Tests whether or not the message satisfies the criteria of the filter.
         * @param message The message to match.
         */
        match(message: Message): boolean;
    }

    /**
     * A message filter that filters messages based on the message url path. The message is considered a match
     * if path in the url of the message begins with the path in the url of the filter.
     */
    export class BaseAddressMessageFilter extends MessageFilter {
        /**
         * Constructs an BaseAddressMessageFilter object.
         * @param url The url to match.
         */
        constructor(url: Url);
        /**
         * Tests whether or not the message satisfies the criteria of the filter.
         * @param message The message to match.
         */
        match(message: Message): boolean;
    }

    export class RpcBehavior implements EndpointBehavior {
        applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void;
    }

    export class RegExpAddressMessageFilter extends MessageFilter {
        constructor(pattern: RegExp);
        match(message: Message): boolean;
    }

    export class VersioningBehavior implements ContractBehavior, EndpointBehavior {
        /**
         * Constructs a VersioningBehavior object.
         * @param version Optional. The current contract version. If not specified the version from the ContractDescription
         * is used.
         */
        constructor(version?: string);
        applyContractBehavior(description: ContractDescription, endpoint: DispatchEndpoint): void;
        applyEndpointBehavior(description: EndpointDescription, endpoint: DispatchEndpoint): void;
    }

    class HttpError implements Error {
        /**
         * The name of the error.
         */
        name: string;
        /**
         * A human readable message explaining the reason for the error.
         */
        message: string;
        /**
         * The HTTP status code.
         */
        statusCode: HttpStatusCode;
        /**
         * The stack trace.
         */
        stack: string;
        constructor();
        constructor(statusCode: HttpStatusCode);
        constructor(message: string);
        constructor(statusCode: HttpStatusCode, message: string);
        /**
         * Returns true if the error is a HttpError; otherwise, returns false.
         * @param err The error.
         */
        static isHttpError(err: Error): boolean;
    }

    /**
     * Interface for a constructor.
     */
    interface Constructor {
        name?: string;
        new(...args: any[]): any;
    }

    class RequestDispatcher extends events.EventEmitter {
        closeTimeout: number;
        services: DispatchService[];
        logger: Logger;
        /**
         * Dispatches a request.
         * @param request The request to dispatch.
         */
        dispatch(request: RequestContext): void;
        /**
         * Validates that the dispatcher is correctly configured.
         */
        validate(): void;
        /**
         * Closes the dispatcher. If any requests do not complete within 'closeTimeout', they are aborted.
         * @param callback Optional. Called after dispatcher is closed.
         */
        close(callback?: Callback): void;
    }

    /**
     * Logger options.
     */
    interface LoggerOptions {
        /**
         * Dictionary of custom serializers. The key is the name of the property that is serialized and the the value
         * is a function that takes an object and returns a JSON serializable value.
         */
        serializers?: {
            [key: string]: (input: any) => any;
        }
    }

    /**
     * Generic interface for a lookup table.
     */
    interface Lookup<T> {
        [key: string]: T;
    }

    class DispatchEndpoint {
        service: DispatchService;
        /**
         * The endpoint address.
         */
        address: Url;
        filter: MessageFilter;
        filterPriority: number;
        contractName: string;
        operations: DispatchOperation[];
        operationSelector: OperationSelector;
        unhandledOperation: DispatchOperation;
        messageInspectors: MessageInspector[];
        errorHandlers: ErrorHandler[];
        faultFormatter: FaultFormatter;
        /**
         * Specifies whether to include the error message and stack trace in faults created from errors. This should not
         * be turned on in production.
         */
        includeErrorDetailInFault: boolean;
        constructor(service: DispatchService, address: Url, contractName: string);
        /**
         * Validates that the endpoint is correctly configured.
         */
        validate(): void;
        chooseOperation(message: Message): DispatchOperation;
    }

    class DispatchOperation {
        endpoint: DispatchEndpoint;
        name: string;
        formatter: MessageFormatter;
        invoker: OperationInvoker;
        isOneWay: boolean;
        constructor(endpoint: DispatchEndpoint, name: string);
        /**
         * Validates that the operation is correctly configured.
         */
        validate(): void;
    }

    class DispatchService {
        dispatcher: RequestDispatcher;
        name: string;
        endpoints: DispatchEndpoint[];
        instanceProvider: InstanceProvider;
        /**
         * Specifies whether to create an OperationContext for operations in this service. The default value is 'true'.
         */
        operationContextRequired: boolean;
        constructor(dispatcher: RequestDispatcher, name: string);
        /**
         * Validates that the service is correctly configured.
         */
        validate(): void;
    }

    /**
     * Interface for callback that does not have a result.
     */
    interface Callback {
        (err?: Error): void;
    }

    /**
     * Generic interface for callback that has a result.
     */
    interface ResultCallback<T> {
        (err?: Error, result?: T): void;
    }
}
