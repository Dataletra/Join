import { ITaskList } from '../../interfaces/itasklist';
import { Status } from '../../interfaces/status';

export class TaskList implements ITaskList {
    id: number = 0;
    status: Status = Status.todo;
    order: number[] = [];

    constructor(taskList: Partial<ITaskList> | null = {}) {
        this.id = taskList?.id ?? 0;
        this.status = taskList?.status ?? Status.todo;
        this.order = taskList?.order ?? [];
    }

    getCleanAddJson() {
        return {
            status: this.status,
            order: this.order,
        };
    }
}
