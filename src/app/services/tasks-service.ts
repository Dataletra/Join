import { inject, Service, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { ITask } from '../interfaces/itask';
import { Task } from '../components/models/task';
import { Status } from '../interfaces/enums';
import { Toast, ToastType } from './toast';

@Service()
export class TasksService {
    supabase = inject(SupabaseService).supabase;
    tasklist = signal<ITask[]>([]);
    toastService = inject(Toast);

    ngOnDestroy() {
        this.supabase.removeChannel(this.channelTaskInsert);
        this.supabase.removeChannel(this.channelTaskUpdate);
        this.supabase.removeChannel(this.channelTaskDelete);
    }

    channelTaskInsert = this.supabase
        .channel('task-insert-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
            this.tasklist.update((list) => [...list, new Task(payload.new)]);
            this.toastService.showToast('Task added to board', ToastType.insertTask);
        })
        .subscribe();

    channelTaskUpdate = this.supabase
        .channel('task-update-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' }, (payload) => {
            this.tasklist.update((list) =>
                list.map((task) => (task.id === payload.new['id'] ? { ...task, ...payload.new } : task))
            );
            this.toastService.showToast('Task udpated succesfully', ToastType.updateTask);
        })
        .subscribe();

    channelTaskDelete = this.supabase
        .channel('task-delete-channel')
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tasks' }, (payload) => {
            this.tasklist.update((list) => list.filter((task) => task.id !== payload.old['id']));
            this.toastService.showToast('Task removed from board', ToastType.updateTask);
        })
        .subscribe();

    async getTasks() {
        let { data, error } = await this.supabase.from('tasks').select('*');
        if (!data) return;
        this.tasklist.set(data.map((task) => new Task(task)));
    }

    async addTask(task: Task) {
        this.toastService.setTypeMatch(ToastType.insertTask);
        const taskData = task.getCleanAddJson();
        const { data, error } = await this.supabase.from('tasks').insert([taskData]).select();
    }

    async editTask(task: Task, showToast: boolean = false) {
        this.toastService.setTypeMatch(showToast ? ToastType.updateTask : ToastType.none);
        const taskData = task.getCleanAddJson();
        const { data, error } = await this.supabase.from('tasks').update(taskData).eq('id', task.id).select();
    }

    async editStatus(id: number | undefined, status: Status) {
        if (this.getTaskPerId(id)) {
            const { data, error } = await this.supabase.from('tasks').update({ status: status }).eq('id', id).select();
        }
    }

    async deleteTask(id: number) {
        this.toastService.setTypeMatch(ToastType.deleteTask);
        const { error } = await this.supabase.from('tasks').delete().eq('id', id);
    }

    getTaskPerId(id: number | undefined): ITask | undefined {
        return id ? this.tasklist().find((task) => task.id === id) : undefined;
    }

    findString(searchkey: string): number[] {
        const results: number[] = [];
        for (const task of this.tasklist()) {
            if (
                task.title.toLowerCase().includes(searchkey.toLowerCase()) ||
                task.description.toLowerCase().includes(searchkey.toLowerCase())
            ) {
                results.push(task.id);
            }
        }
        return results;
    }
}
