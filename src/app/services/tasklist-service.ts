import { Service, signal, inject } from '@angular/core';
import { ITaskList } from '../interfaces/itasklist';
import { TaskList } from '../components/models/tasklist';
import { SupabaseService } from './supabase';

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

    async editUser(taskList: TaskList) {
        const userData = taskList.getCleanAddJson();
        const { data, error } = await this.supabase.from('user').update([userData]).eq('id', taskList.id).select();
    }

    ngOnDestroy() {
        this.supabase.removeChannel(this.channeTaskListUpdate);
    }
}
