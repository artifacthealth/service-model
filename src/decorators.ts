import { makeDecorator } from "reflect-helper";
import { Constructor } from "./common/constructor";
import { VersioningBehavior } from "./behaviors/versioningBehavior";
import { ContractAnnotation, OperationAnnotation } from "./annotations";
import { DebugBehavior } from "./behaviors/debugBehavior";

export var Contract: (name?: string) => ClassDecorator = makeDecorator(ContractAnnotation);
export var Operation: (args?: { name?: string; isOneWay?: boolean; timeout?: number; contract?: string }) => PropertyDecorator = makeDecorator(OperationAnnotation);
export var Versioning: (args: { version: string, contract?: string }) => ClassDecorator = makeDecorator(VersioningBehavior);
export var Debug: () => ClassDecorator = makeDecorator(DebugBehavior);
