/// <reference path="../common/types.d.ts" />

interface OperationInvoker {

    invoke(instance: Object, args: any[], callback: ResultCallback<any>):  void;
}

export = OperationInvoker;
