import { ITask, ISubtask } from '../../interfaces/itask';
import { Status } from '../../interfaces/status';

export class Task implements ITask {
    id: number = 0;
    created_at: string = '';
    title: string = '';
    description: string = '';
    category: 'User Story' | 'Technical Task' = 'User Story';
    priority: 'low' | 'medium' | 'urgent' = 'medium';
    status: Status = Status.todo;
    user_ids: number[] = [];
    subtasks: ISubtask[] = [];
    due_date: string = '';

    constructor(task: Partial<ITask> | null = {}) {
        this.id = task?.id ?? 0;
        this.created_at = task?.created_at ?? new Date().toISOString();
        this.title = task?.title ?? '';
        this.description = task?.description ?? '';
        this.category = task?.category ?? 'User Story';
        this.priority = task?.priority ?? 'medium';
        this.status = task?.status ?? Status.todo;
        this.user_ids = task?.user_ids ?? [];
        this.subtasks = task?.subtasks ?? [];
        this.due_date = task?.due_date ?? new Date().toISOString();
    }

    getCleanAddJson() {
        return {
            created_at: this.created_at,
            title: this.title,
            description: this.description,
            category: this.category,
            priority: this.priority,
            status: this.status,
            user_ids: this.user_ids,
            subtasks: this.subtasks,
            due_date: this.due_date,
        };
    }
}
