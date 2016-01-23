import { makeDecorator } from "reflect-helper";
import { Constructor } from "./common/constructor";
import { VersioningBehavior } from "./behaviors/versioningBehavior";
import { DebugBehavior } from "./behaviors/debugBehavior";
import { ContractAnnotation } from "./description/contractAnnotation";
import { OperationAnnotation } from "./description/operationAnnotation";
import {OperationOptions} from "./description/operationOptions";
import {VersioningOptions} from "./behaviors/versioningOptions";

/**
 * Specifies that a class implements a contract.
 * @param name The name of the contract.
 */
export declare function Contract(name?: string): ClassDecorator;

/**
 * Specifies that a method on a service is an operation on a service contract.
 * @param options The options for the operation.
 */
export declare function Operation(options?: OperationOptions): PropertyDecorator;

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
 * We declare the decorator in this roundabout way to make it easier to document the decorators using TypeDoc.
 */
exports.Contract = makeDecorator(ContractAnnotation);
exports.Operation = makeDecorator(OperationAnnotation);
exports.Versioning = makeDecorator(VersioningBehavior);
exports.Debug = makeDecorator(DebugBehavior);