import { Service, signal, inject } from '@angular/core';
import { ITaskList } from '../interfaces/itasklist';
import { SupabaseService } from './supabase';
import { Status } from '../interfaces/status';

@Service()
export class TaskListService {
    supabase = inject(SupabaseService).supabase;
    taskMap = signal<Map<Status, number[]>>(new Map<Status, number[]>());

    channeTaskListUpdate = this.supabase
        .channel('tasklist-update-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'taskList' }, (payload) => {
            this.taskMap.update(
                (taskMap) => {
                    const updatedMap = new Map(taskMap);
                    updatedMap.set(payload.new['status'], payload.new['order']);
                    return updatedMap;
                }
            );
        })
        .subscribe();

    async getTaskLists() {
        let { data: taskList, error } = await this.supabase.from('taskList').select('*');
        if (!taskList) {
            return;
        }
        const taskMap = new Map<Status, number[]>();
        for (let statusRow of taskList) {
            taskMap.set(statusRow.status, statusRow.order);
        }
        this.taskMap.set(taskMap);
    }

    async editTaskList(taskMap: ITaskList) {
        const { data, error } = await this.supabase
            .from('taskList')
            .update([taskMap])
            .eq('status', taskMap.status)
            .select();
    }

    getStatusList(status: Status): number[] | null {
        return this.taskMap().get(status) ?? null;
    }

    ngOnDestroy() {
        this.supabase.removeChannel(this.channeTaskListUpdate);
    }
}
