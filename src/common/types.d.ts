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

interface Constructor<T> {

    name?: string;
    new(...args: any[]): T;
}

interface Lookup<T> {

    [key: string]: T;
}