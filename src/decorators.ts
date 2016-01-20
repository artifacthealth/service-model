import { makeDecorator } from "reflect-helper";
import { Constructor } from "./common/constructor";
import { VersioningBehavior } from "./behaviors/versioningBehavior";
import { ContractAttribute, OperationAttribute } from "./attributes";

export var Contract = <ContractFactory>makeDecorator(ContractAttribute);
export var Operation = <OperationFactory>makeDecorator(OperationAttribute);
export var Versioning = <VersioningBehaviorFactory>makeDecorator(VersioningBehavior);


export interface ContractFactory {

    (name?: string): TypeDecorator;
}

export interface OperationFactory {

    (args?: { name?: string; isOneWay?: boolean; timeout?: number; contract?: string }): PropertyDecorator;
}

export interface VersioningBehaviorFactory {

    (args: { version: string, contract?: string }): TypeDecorator;
}

export interface TypeDecorator {

    (target: Object): void;
}

export interface PropertyDecorator {

    (target: Object, propertyName: string): void;
}
