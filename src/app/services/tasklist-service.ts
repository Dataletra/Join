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

    async editApiTaskList(taskList: ITaskList) {
        const { data, error } = await this.supabase
            .from('taskList')
            .update([taskList])
            .eq('status', taskList.status)
            .select();
    }

    async editApiTaskMap(taskMap: Map<Status, number[]>) {
        for (const [status, tasks] of taskMap) {
            await this.editApiTaskList({ status: status, order: tasks });
        }
    }

    moveApiItem(id: number, statusNew: Status) {
        for (const [status, taskList] of this.taskMap()) {
            const index = taskList.indexOf(id);
            if (index >= 0) {
                taskList.splice(index, 1);
                this.editApiTaskList({ status: status, order: taskList });
                break;
            }
        }
        const updatedStatus = this.taskMap().get(statusNew);
        if (updatedStatus) {
            updatedStatus.push(id);
            this.editApiTaskList({ status: statusNew, order: updatedStatus });
        }
    }

    getStatusList(status: Status): number[] | null {
        return this.taskMap().get(status) ?? null;
    }

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

    ngOnDestroy() {
        this.supabase.removeChannel(this.channeTaskListUpdate);
    }
}
