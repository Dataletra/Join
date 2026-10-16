import { Service, signal, inject } from '@angular/core';
import { ITaskList } from '../interfaces/itasklist';
import { TaskList } from '../components/models/tasklist';
import { SupabaseService } from './supabase';
import { Status } from '../interfaces/status';

@Service()
export class TaskListService {
    supabase = inject(SupabaseService).supabase;
    taskLists = signal<ITaskList[]>([]);

    channeTaskListUpdate = this.supabase
        .channel('tasklist-update-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'taskList' }, (payload) => {
            this.taskLists.update((list) =>
                list.map((statusRow) =>
                    statusRow.id === payload.new['id'] ? { ...statusRow, ...payload.new } : statusRow
                )
            );
        })
        .subscribe();

    async getTaskLists() {
        let { data: taskList, error } = await this.supabase.from('taskList').select('*');
        if (!taskList) return;
        this.taskLists.set(taskList);
    }

    async editTaskList(taskList: ITaskList | TaskList | null) {
        if (taskList) {
            const taskListData =
                taskList instanceof TaskList ? taskList.getCleanAddJson() : new TaskList(taskList).getCleanAddJson();
            console.log('Converted to', taskListData, typeof taskList);

            const { data, error } = await this.supabase
                .from('taskList')
                .update([taskListData])
                .eq('id', taskList?.id)
                .select();
        }
    }

    getStatusList(status: Status): ITaskList | null {
        const index = this.taskLists().findIndex((row: ITaskList) => {
            return status === row.status;
        });
        return index >= 0 ? this.taskLists()[index] : null;
    }

    ngOnDestroy() {
        this.supabase.removeChannel(this.channeTaskListUpdate);
    }
}
