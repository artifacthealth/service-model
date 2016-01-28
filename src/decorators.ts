import { makeDecorator } from "reflect-helper";
import { Constructor } from "./common/constructor";
import { VersioningBehavior, VersioningOptions } from "./behaviors/versioningBehavior";
import { DebugBehavior } from "./behaviors/debugBehavior";
import { ServiceBehaviorAnnotation, ServiceOptions } from "./behaviors/serviceBehaviorAnnotation";
import {
    ContractAnnotation,
    OperationAnnotation,
    WebInvokeOptions,
    WebGetAnnotation,
    WebPostAnnotation,
    WebPutAnnotation,
    WebDeleteAnnotation,
    WebHeadAnnotation,
    WebInvokeAnnotation,
    InjectBodyAnnotation,
    OperationOptions
} from "./annotations";

/**
 * Specifies that a class implements a contract.
 * @param name The name of the contract.
 */
export declare function Contract(name?: string): ClassDecorator;

/**
 * Specifies that a method on a service is an operation on a service contract.
 * @param options The options for the operation.
 */
export declare function Operation(options?: OperationOptions): MethodDecorator;

/**
 * Allows configuration of options for a service.
 * @param options The options for the service.
 */
export declare function Service(options?: ServiceOptions): ClassDecorator;

/**
 * Specifies that [[VersioningBehavior]] should be used for a service contract. If used, the version of the contract
 * must be provided in [semver](http://semver.org/) format.
 * @param options The options provided to the [[VersioningBehavior]].
 *
 * ### Example
 *
 * ```typescript
 *  @Contract("Calculator")
 *  @Versioning({ version: "1.0.0" })
 *  export class CalculatorService {
 *      ...
 *  }
 * ```
 */
export declare function Versioning(options: VersioningOptions): ClassDecorator;

/**
 * Specifies that a service should provide error details, such as stack traces, in errors that are returned to the client.
 * This decorator should not be used in production.
 *
 * ### Example
 *
 * ```typescript
 *  @Contract("Calculator")
 *  @Debug()
 *  export class CalculatorService {
 *      ...
 *  }
 * ```
 */
export declare function Debug(): ClassDecorator;

/**
 * Specifies that the operation is callable via a REST api. This is useful for supporting HTTP methods that do not have
 * shortcut decorators. Shortcut decorators are available for GET, POST, PUT DELETE, and HEAD methods.
 * @param options Describes how the operation should be called.
 *
 * ### Example
 *
 * ```typescript
 *  @Operation()
 *  @WebInvoke({ method: "OPTIONS", template: "/{id}" })
 *  getOptions(id: number, callback: ResultCallback<AvailableOptions>): void {
 *      ...
 *  }
 * ```
 */
export declare function WebInvoke(options: WebInvokeOptions): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP GET request. This is a shortcut for WebInvoke with a method of "GET".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 *
 * ### Example
 *
 * ```typescript
 *  @Operation()
 *  @WebGet("/")
 *  getTasks(callback: ResultCallback<Tasks[]>): void {
 *      ...
 *  }
 * ```
 */
export declare function WebGet(template: string): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP POST request. This is a shortcut for WebInvoke with a method of "POST".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 *
 * ### Example
 *
 * ```typescript
 *  @Operation()
 *  @WebPost("/")
 *  createTask(@InjectBody() task: Task, callback: ResultCallback<number>): void {
 *      ...
 *  }
 * ```
 */
export declare function WebPost(template: string): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP PUT request. This is a shortcut for WebInvoke with a method of "PUT".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 *
 * ### Example
 *
 * ```typescript
 *  @Operation()
 *  @WebPut("/{id}")
 *  updateTask(id: number, @InjectBody() task: Task, callback: Callback): void {
 *      ...
 *  }
 * ```
 */
export declare function WebPut(template: string): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP DELETE request. This is a shortcut for WebInvoke with a method of "DELETE".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 *
 * ### Example
 *
 * ```typescript
 *  @Operation()
 *  @WebDelete("/{id}")
 *  deleteTask(id: number, callback: Callback): void {
 *      ...
 *  }
 * ```
 */
export declare function WebDelete(template: string): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP HEAD request. This is a shortcut for WebInvoke with a method of "HEAD".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 *
 * ```typescript
 *  @Operation()
 *  @WebHead("/{id}")
 *  taskExists(id: number, callback: ResultCallback<boolean>): void {
 *      ...
 *  }
 * ```
 */
export declare function WebHead(template: string): MethodDecorator;

/**
 * Specifies that the body of a REST message should be passed to the decorated parameter of a service operation.
 *
 * ### Example
 *
 * In this example the body of the message, a json object containing the task to create, is passed to the `task`
 * parameter on the `createTask` service method.
 *
 * ```typescript
 *  @Operation()
 *  @WebPost("/")
 *  createTask(@InjectBody() task: Task, callback: Callback): void {
 *      ...
 *  }
 * ```
 */
export declare function InjectBody(): ParameterDecorator;

/**
 * We declare the decorator in this roundabout way to make it easier to document the decorators using TypeDoc.
 */
exports.Contract = makeDecorator(ContractAnnotation);
exports.Operation = makeDecorator(OperationAnnotation);
exports.Service = makeDecorator(ServiceBehaviorAnnotation);
exports.Versioning = makeDecorator(VersioningBehavior);
exports.Debug = makeDecorator(DebugBehavior);
exports.WebInvoke = makeDecorator(WebInvokeAnnotation);
exports.WebGet = makeDecorator(WebGetAnnotation);
exports.WebPost = makeDecorator(WebPostAnnotation);
exports.WebPut = makeDecorator(WebPutAnnotation);
exports.WebDelete = makeDecorator(WebDeleteAnnotation);
exports.WebHead = makeDecorator(WebHeadAnnotation);
exports.InjectBody = makeDecorator(InjectBodyAnnotation);