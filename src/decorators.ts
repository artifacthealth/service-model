import { makeDecorator } from "reflect-helper";
import { Constructor } from "./common/constructor";
import { VersioningBehavior } from "./behaviors/versioningBehavior";
import { DebugBehavior } from "./behaviors/debugBehavior";
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
    BodyAnnotation
} from "./annotations";
import { OperationOptions } from "./description/operationOptions";
import { VersioningOptions } from "./behaviors/versioningOptions";

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
 * Specifies that [[VersioningBehavior]] should be used for a service contract. If used, the version of the contract
 * must be provided in [semver](http://semver.org/) format.
 * @param options The options provided to the [[VersioningBehavior]].
 */
export declare function Versioning(options: VersioningOptions): ClassDecorator;

/**
 * Specifies that a service should provide error details, such as stack traces, in errors that are returned to the client.
 * This should be removed in production.
 */
export declare function Debug(): ClassDecorator;

/**
 * Specifies that the operation is callable via a REST api.
 * @param options Describes how the operation should be called.
 */
export declare function WebInvoke(options: WebInvokeOptions): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP GET request. This is a shortcut for WebInvoke with a method of "GET".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 */
export declare function WebGet(template: string): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP POST request. This is a shortcut for WebInvoke with a method of "POST".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 */
export declare function WebPost(template: string): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP PUT request. This is a shortcut for WebInvoke with a method of "PUT".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 */
export declare function WebPut(template: string): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP DELETE request. This is a shortcut for WebInvoke with a method of "DELETE".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 */
export declare function WebDelete(template: string): MethodDecorator;

/**
 * Specifies that the operation is callable via a HTTP HEAD request. This is a shortcut for WebInvoke with a method of "HEAD".
 * @param template The URL template for the operation. For more information, see [[UrlTemplate]].
 */
export declare function WebHead(template: string): MethodDecorator;

/**
 *
 */
export declare function Body(): ParameterDecorator;

/**
 * We declare the decorator in this roundabout way to make it easier to document the decorators using TypeDoc.
 */
exports.Contract = makeDecorator(ContractAnnotation);
exports.Operation = makeDecorator(OperationAnnotation);
exports.Versioning = makeDecorator(VersioningBehavior);
exports.Debug = makeDecorator(DebugBehavior);
exports.WebInvoke = makeDecorator(WebInvokeAnnotation);
exports.WebGet = makeDecorator(WebGetAnnotation);
exports.WebPost = makeDecorator(WebPostAnnotation);
exports.WebPut = makeDecorator(WebPutAnnotation);
exports.WebDelete = makeDecorator(WebDeleteAnnotation);
exports.WebHead = makeDecorator(WebHeadAnnotation);
exports.Body = makeDecorator(BodyAnnotation);