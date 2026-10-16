import { Status } from "./status";

export interface ITaskList{
    id: number,
    status: Status,
    order: number[];
}