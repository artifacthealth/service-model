import { ResultCallback } from "../common/resultCallback";

export interface OperationInvoker {

    invoke(instance: Object, args: any[], callback: ResultCallback<any>):  void;
}
