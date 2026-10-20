import { inject, Service, signal, Signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { ITask } from '../interfaces/itask';
import { Task } from '../components/models/task';

@Service()
export class TasksService {
    supabase = inject(SupabaseService).supabase;
    tasklist = signal<ITask[]>([]);

    channelTaskInsert = this.supabase
        .channel('task-insert-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
            this.tasklist.update((list) => [...list, new Task(payload.new)]);
            console.log('aktuelle Liste', this.tasklist());
        })
        .subscribe();

    async getTasks() {
        let { data, error } = await this.supabase.from('tasks').select('*');
        if (!data) return;
        this.tasklist.set(data.map((task) => new Task(task)));
    }

    getTaskPerId(id: number) {
        return this.tasklist().find((task) => task.id === id);
    }

    async addTask(task: Task) {
        const taskData = task.getCleanAddJson();
        const { data, error } = await this.supabase.from('tasks').insert([taskData]).select();
    }

    ngOnDestroy() {
        this.supabase.removeChannel(this.channelTaskInsert);
    }
}
