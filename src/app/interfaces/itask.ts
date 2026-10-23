import { Status } from './status';

export interface ITask {
    id: number;
    created_at: string;
    title: string;
    description: string;
    category: 'User Story' | 'Technical Task';
    dueDate: string;
    priority: 'lowPrio' | 'medPrio' | 'hiPrio';
    status: Status;
    user_ids: number[];
    subtasks: ISubtask[];
    due_date: string;
}

export interface ITaskUser {
    id: number;
    name: string;
}

export interface ISubtask {
    title: string;
    completed: boolean;
}
