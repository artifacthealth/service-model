import { Operation, Contract, WebGet, WebPost, WebPut, WebDelete, WebHead, InjectBody } from "../../src/decorators";
import { ResultCallback } from "../../src/common/resultCallback";

@Contract("Todo")
export class TodoService {

    @Operation()
    @WebGet("/")
    getTasks(callback: ResultCallback<Task[]>): void {

    }

    @Operation()
    @WebGet("/{id}")
    getTask(id: number, callback: ResultCallback<Task>): void {

    }

    @Operation()
    @WebHead("/{id}")
    taskExists(id: number, callback: ResultCallback<boolean>): void {

    }

    @Operation()
    @WebPost("/")
    createTask(@InjectBody() task: Task, callback: ResultCallback<number>): void {

    }

    @Operation()
    @WebPut("/{id}")
    updateTask(id: number, @InjectBody() task: Task, callback: Callback): void {

    }

    @Operation()
    @WebDelete("/{id}")
    deleteTask(id: number, callback: Callback): void {

    }

    @Operation()
    nonRestOperation(id: number, callback: Callback): void {

    }
}

export interface Task {

    id?: number;
    text: string;
    done?: boolean;
}
