import "reflect-metadata";
import { Constructor } from "./common/constructor";
import * as ReflectHelper from "./common/reflectHelper";
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

function makeDecorator(attributeCtr: Constructor<any>) {

    return function DecoratorFactory(...args: any[]) {

        var attributeInstance = Object.create(attributeCtr.prototype);
        attributeCtr.apply(attributeInstance, args);

        return function Decorator(target: Object, propertyName?: string): void {

            ReflectHelper.addAttribute(attributeInstance, target, propertyName);
        }
    }
}