import { Status } from "./status";

export interface ITask {
    id: number;
    created_at: string;
    title: string;
    description: string;
    category: 'User Story' | 'Technical Task';
    priority: 'low' | 'medium' | 'urgent';
    status: Status;
    assignedTo: ITaskUser[];
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
