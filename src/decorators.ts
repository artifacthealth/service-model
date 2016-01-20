import { makeDecorator } from "reflect-helper";
import { Constructor } from "./common/constructor";
import { VersioningBehavior } from "./behaviors/versioningBehavior";
import { ContractAttribute, OperationAttribute } from "./attributes";
import { DebugBehavior } from "./behaviors/debugBehavior";

export var Contract = <ContractFactory>makeDecorator(ContractAttribute);
export var Operation = <OperationFactory>makeDecorator(OperationAttribute);
export var Versioning = <VersioningBehaviorFactory>makeDecorator(VersioningBehavior);
export var Debug = <DebugBehaviorFactory>makeDecorator(DebugBehavior);


export interface ContractFactory {

    (name?: string): ClassDecorator;
}

export interface OperationFactory {

    (args?: { name?: string; isOneWay?: boolean; timeout?: number; contract?: string }): PropertyDecorator;
}

export interface VersioningBehaviorFactory {

    (args: { version: string, contract?: string }): ClassDecorator;
}

export interface DebugBehaviorFactory {

    (): ClassDecorator;
}
