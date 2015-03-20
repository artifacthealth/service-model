import ResultCallback = require("../common/resultCallback");

interface OperationInvoker {

    invoke(instance: Object, args: any[], callback: ResultCallback<any>):  void;
}

export = OperationInvoker;
