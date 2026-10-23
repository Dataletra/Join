import { Status } from './enums';

export interface ITask {
    id: number;
    created_at: string;
    title: string;
    description: string;
    category: 'User Story' | 'Technical Task';
    due_date: string;
    priority: 'lowPrio' | 'medPrio' | 'hiPrio';
    status: Status;
    user_ids: number[];
    subtasks: ISubtask[];
}

export interface ITaskUser {
    id: number;
    name: string;
}

export interface ISubtask {
    title: string;
    completed: boolean;
}
