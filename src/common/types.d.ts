/// <reference path="../../typings/async.d.ts" />
/// <reference path="../../typings/node.d.ts" />
/// <reference path="../../typings/tsreflect.d.ts" />
/// <reference path="../../typings/change-case.d.ts" />

interface Callback {

    (err?: Error): void;
}

interface ResultCallback<T> {

    (err?: Error, result?: T): void;
}

interface Constructor {

    name?: string;
    new(...args: any[]): any;
}

interface Lookup<T> {

    [key: string]: T;
}

interface Error {
    stack?: string;
}

interface ErrorConstructor {
    captureStackTrace(error: Error, constructorOpt: Function): void;
}