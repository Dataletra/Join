import { Service, signal, inject } from '@angular/core';
import { ITaskList } from '../interfaces/itasklist';
import { SupabaseService } from './supabase';
import { Status } from '../interfaces/enums';

@Service()
export class TaskListService {
    supabase = inject(SupabaseService).supabase;
    taskMap = signal<Map<Status, number[]>>(new Map<Status, number[]>());

    channeTaskListUpdate = this.supabase
        .channel('tasklist-update-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'taskList' }, (payload) => {
            this.taskMap.update((taskMap) => {
                const updatedMap = new Map(taskMap);
                updatedMap.set(payload.new['status'], payload.new['order']);
                return updatedMap;
            });
        })
        .subscribe();

    /**
     * Fetch all tasklists from databank and set it into local memory.
     * @returns void on error
     */
    async fetchTaskLists() {
        let { data: taskList, error } = await this.supabase.from('taskList').select('*');
        if (!taskList) {
            return;
        }
        const taskMap = new Map<Status, number[]>();
        for (const statusRow of taskList) {
            taskMap.set(statusRow.status, statusRow.order);
        }
        this.taskMap.set(taskMap);
    }

    /**
     * Edit a tasklist from databank.
     * @param taskList {ITaskList} - to be updated
     */
    async editApiTaskList(taskList: ITaskList) {
        const { data, error } = await this.supabase
            .from('taskList')
            .update([taskList])
            .eq('status', taskList.status)
            .select();
    }

    /**
     * Update complete tasklist map on databank.
     * @param taskMap {Map<Status, number[]>} - map to be updated
     */
    async editApiTaskMap(taskMap: Map<Status, number[]>) {
        for (const [status, tasks] of taskMap) {
            await this.editApiTaskList({ status: status, order: tasks });
        }
    }

    /**
     * Add a new task to the bottom of tasklist defined by status.
     * @param id {number} - id of task
     * @param status {Status} - initial status (tasklist)
     */
    addTask(id: number, status: Status) {
        const newList = this.taskMap().get(status);
        if (newList) {
            newList.push(id);
            const newTaskList: ITaskList = { status: status, order: newList };
            this.editApiTaskList(newTaskList);
        }
    }

    /**
     * Remove Task from local task lists.
     * @param id {number} - task to be deleted
     */
    deleteTask(id: number) {
        for (const [status, tasks] of this.taskMap()) {
            const index = tasks.indexOf(id);
            if (index >= 0) {
                tasks.splice(index, 1);
            }
        }
    }

    /**
     * Move Task to another status and update task itself and tasklists accordingly.
     * @param id {number} - task to be moved
     * @param statusNew {Status} - destination status
     */
    moveApiItem(id: number, statusNew: Status) {
        for (const [status, taskList] of this.taskMap()) {
            const index = taskList.indexOf(id);
            if (index >= 0 && status !== statusNew) {
                taskList.splice(index, 1);
                this.editApiTaskList({ status: status, order: taskList });
                break;
            }
        }
        const updatedStatus = this.taskMap().get(statusNew);
        if (updatedStatus && updatedStatus.indexOf(id) < 0) {
            updatedStatus.push(id);
            this.editApiTaskList({ status: statusNew, order: updatedStatus });
        }
    }

    /**
     * Get local list by status.
     * @param status {Status} - status of target list.
     * @returns number[]
     */
    getStatusList(status: Status): number[] | null {
        return this.taskMap().get(status) ?? null;
    }

    /**
     * Filter the local data by given ids.
     * @param ids {number[]} ids to be use as filter
     * @returns
     */
    filter(ids: number[]): Map<Status, number[]> {
        const filteredMap: Map<Status, number[]> = new Map<Status, number[]>();
        for (const [status, tasks] of this.taskMap()) {
            filteredMap.set(
                status,
                tasks.filter((n) => ids.includes(n))
            );
        }
        return filteredMap;
    }

    /**
     * Remove channel subscription
     */
    ngOnDestroy() {
        this.supabase.removeChannel(this.channeTaskListUpdate);
    }
}
