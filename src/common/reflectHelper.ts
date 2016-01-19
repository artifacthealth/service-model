///<reference path="../../typings/reflect-metadata.d.ts"/>

import "reflect-metadata";

import { Constructor } from "./constructor";
import { Parameter } from "../description/parameter";

export function getReturnType(ctr: Constructor<any>, method: string): Object {

    return Reflect.getMetadata('design:returntype', ctr, method)
}

export function getParameters(ctr: Constructor<any>, method: string): Parameter[] {

    var types = getParameterTypes(ctr, method);
    if(types) {

        var names = getParameterNames((<any>ctr)[method]),
            params: Parameter[] = new Array(types.length);

        for (var i = 0; i < params.length; i++) {
            params[i] = {
                name: names[i],
                type: types[i]
            }
        }

        return params;
    }
}


export function getParameterTypes(ctr: Constructor<any>, method: string): Object[] {

    return Reflect.getMetadata('design:paramtypes', ctr, method);
}

// Code below for getParameterNames is modified code from AngularJS
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;


function getParameterNames(fn: Function): string[] {

    if(typeof fn === "function") {

        var names: string[] = [];

        var fnText = fn.toString().replace(STRIP_COMMENTS, '');
        var argDecl = fnText.match(FN_ARGS);
        argDecl[1].split(FN_ARG_SPLIT).forEach((arg: string) => {
            names.push(arg.trim());
        });

        return names;
    }
}

export function addAttribute(value: any, target: Object, propertyName?: string): void {

    var attributes = getOwnMetadata(target, propertyName);
    attributes.push(value);
    Reflect.defineMetadata('servicemodel:attributes', attributes, target, propertyName);
}

export function getOwnAttributes(target: Object, propertyName?: string): any[];
export function getOwnAttributes<T>(attributeCtr: Constructor<T>, target: Object, propertyName?: string) : T[];
export function getOwnAttributes(attributeCtrOrTarget: any, targetOrPropertyName?: any, propertyName?: string): any[] {

    var attributeCtr: Constructor<any>,
        target: Object;

    if(typeof targetOrPropertyName === "string" || targetOrPropertyName === undefined) {
        target = attributeCtrOrTarget;
        propertyName = targetOrPropertyName;
    }
    else {
        attributeCtr = attributeCtrOrTarget;
        target = targetOrPropertyName;
    }

    var attributes = getOwnMetadata(target, propertyName);

    if(attributeCtr) {
        attributes = attributes.filter(attribute => attribute instanceof attributeCtr);
    }

    return attributes;
}

export function hasOwnAttribute(attributeCtr: Constructor<any>, target: Object, propertyName?: string): boolean {

    return getOwnAttributes(attributeCtr, target, propertyName).length > 0;
}

function getOwnMetadata(target: Object, propertyName?: string): any[] {

    return Reflect.getOwnMetadata('servicemodel:attributes', target, propertyName) || [];
}
