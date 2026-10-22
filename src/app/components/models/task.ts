import { ISubtask, ITask, ITaskUser } from '../../interfaces/itask';
import { Status } from '../../interfaces/status';

export class Task implements ITask {
    id: number = 0;
    created_at: string = '0000-00-00T00:00:00.000Z';
    title: string = 'Title';
    description: string = 'Description';
    category: 'Technical Task' | 'User Story' = 'Technical Task';
    dueDate: string = '';
    priority: 'lowPrio' | 'medPrio' | 'hiPrio' = 'medPrio';
    status: Status = Status.todo;
    assignedTo: ITaskUser[] = [];
    subtasks: ISubtask[] = [];

    constructor(task: Partial<ITask> | null = {}) {
        this.id = task?.id ?? 0;
        this.created_at = task?.created_at ?? '0000-00-00T00:00:00.000Z';
        this.title = task?.title ?? '';
        this.description = task?.description ?? '';
        this.category = task?.category ?? 'Technical Task';
        this.dueDate = task?.dueDate ?? '';
        this.priority = task?.priority ?? 'medPrio';
        this.status = task?.status ?? Status.todo;
        this.assignedTo = task?.assignedTo ?? [];
        this.subtasks = task?.subtasks ?? [];
    }

    getCleanAddJson() {
        return {
            title: this.title,
            description: this.description,
            category: this.category,
            dueDate: this.dueDate,
            priority: this.priority,
            status: this.status,
            assignedTo: this.assignedTo,
            subtasks: this.subtasks,
        };
    }
}
