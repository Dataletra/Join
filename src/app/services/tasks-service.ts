import { inject, Service, signal, Signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { ITask } from '../interfaces/itask';

@Service()
export class TasksService {
    supabase = inject(SupabaseService).supabase;
    tasklist = signal<ITask[]>([]);

    async getTasks() {
        let { data: task, error } = await this.supabase.from('tasks').select('*');
        if (!task) return;
        this.tasklist.set(task);
    }
}
