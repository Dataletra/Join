import { ISubtask, ITask } from '../../interfaces/itask';
import { Status, Priority } from '../../interfaces/enums';

export class Task implements ITask {
    id: number = 0;
    created_at: string = '0000-00-00T00:00:00.000Z';
    title: string = 'Title';
    description: string = 'Description';
    category: 'Technical Task' | 'User Story' = 'Technical Task';
    due_date: string = '';
    priority: Priority = Priority.medium;
    status: Status = Status.todo;
    user_ids: number[] = [];
    subtasks: ISubtask[] = [];

    constructor(task: Partial<ITask> | null = {}) {
        this.id = task?.id ?? 0;
        this.created_at = task?.created_at ?? '0000-00-00T00:00:00.000Z';
        this.title = task?.title ?? '';
        this.description = task?.description ?? '';
        this.category = task?.category ?? 'Technical Task';
        this.due_date = task?.due_date ?? '';
        this.priority = task?.priority ?? Priority.medium;
        this.status = task?.status ?? Status.todo;
        this.user_ids = task?.user_ids ?? [];
        this.subtasks = task?.subtasks ?? [];
    }

    getCleanAddJson() {
        return {
            title: this.title,
            description: this.description,
            category: this.category,
            due_date: this.due_date,
            priority: this.priority,
            status: this.status,
            user_ids: this.user_ids,
            subtasks: this.subtasks,
        };
    }
}
