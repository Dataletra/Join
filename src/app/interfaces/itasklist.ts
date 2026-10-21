import { Status } from "./status";

export interface ITaskList{
    status: Status,
    order: number[];
}