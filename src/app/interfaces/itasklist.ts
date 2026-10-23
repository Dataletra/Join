import { Status } from './enums';

export interface ITaskList {
    status: Status;
    order: number[];
}
