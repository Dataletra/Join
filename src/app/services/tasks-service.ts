import { inject, Service, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { ITask } from '../interfaces/itask';
import { Task } from '../components/models/task';
import { Status } from '../interfaces/enums';
import { Toast, ToastType } from './toast';
import { TaskListService } from './tasklist-service';

@Service()
export class TasksService {
    supabase = inject(SupabaseService).supabase;
    tasklist = signal<ITask[]>([]);
    toastService = inject(Toast);
    taskSortService = inject(TaskListService);

    /**
     * remove channel subscription
     */
    ngOnDestroy() {
        this.supabase.removeChannel(this.channelTaskInsert);
        this.supabase.removeChannel(this.channelTaskUpdate);
        this.supabase.removeChannel(this.channelTaskDelete);
    }

    channelTaskInsert = this.supabase
        .channel('task-insert-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
            const newTask = new Task(payload.new);
            this.tasklist.update((list) => [...list, newTask]);
            this.taskSortService.addTask(newTask.id, newTask.status);
            this.toastService.showToast('Task added to board', ToastType.insertTask);
        })
        .subscribe();

    channelTaskUpdate = this.supabase
        .channel('task-update-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' }, (payload) => {
            const newTask = new Task(payload.new);
            this.tasklist.update((list) =>
                list.map((task) => (task.id === payload.new['id'] ? { ...task, ...newTask } : task))
            );
            this.taskSortService.moveApiItem(newTask.id, newTask.status);
            this.toastService.showToast('Task udpated succesfully', ToastType.updateTask);
        })
        .subscribe();

    channelTaskDelete = this.supabase
        .channel('task-delete-channel')
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tasks' }, (payload) => {
            this.tasklist.update((list) => list.filter((task) => task.id !== payload.old['id']));
            this.taskSortService.deleteTask(payload.old['id']);
            this.toastService.showToast('Task removed from board', ToastType.deleteTask);
        })
        .subscribe();

    /**
     * Fetch all tasks from database.
     * @returns void
     */
    async fetchTasks() {
        let { data, error } = await this.supabase.from('tasks').select('*');
        if (!data) return;
        this.tasklist.set(data.map((task) => new Task(task)));
    }

    /**
     * Upload new task to database.
     * @param task {Task} - to add
     */
    async addApiTask(task: Task) {
        this.toastService.setTypeMatch(ToastType.insertTask);
        const taskData = task.getCleanAddJson();
        const { data, error } = await this.supabase.from('tasks').insert([taskData]).select();
    }

    /**
     * Edit task on database
     * @param task {Task} - updated task
     * @param showToast - wether to show a success toast.
     */
    async editApiTask(task: Task, showToast: boolean = false) {
        const oldTask = this.getTaskPerId(task.id);
        if (oldTask) {
            this.toastService.setTypeMatch(showToast ? ToastType.updateTask : ToastType.none);
            const taskData = task.getCleanAddJson();
            const { data, error } = await this.supabase.from('tasks').update(taskData).eq('id', task.id).select();
        }
    }

    /**
     * Edit status of a databaes task
     * @param id {number | undefined} - id of destination task
     * @param status {Status} - new status
     */
    async editApiStatus(id: number | undefined, status: Status) {
        if (id && this.getTaskPerId(id)) {
            const { data, error } = await this.supabase.from('tasks').update({ status: status }).eq('id', id).select();
        }
    }

    /**
     * Delete Task from database
     * @param id {number} - id to be deleted
     */
    async deleteApiTask(id: number) {
        this.toastService.setTypeMatch(ToastType.deleteTask);
        const { error } = await this.supabase.from('tasks').delete().eq('id', id);
    }

    /**
     * Get local task.
     * @param id {number | undefined} - task id to get task details from.
     * @returns task on success, else undefined
     */
    getTaskPerId(id: number | undefined): ITask | undefined {
        return id ? this.tasklist().find((task) => task.id === id) : undefined;
    }

    /**
     * Searh all local tasks for given string occurence in title and description.
     * @param searchkey {string} - search string
     * @returns {number[]} - id array of all matches.
     */
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

    /**
     * Delete user form all tasks connected to that user.
     * @param userId {number | null} - deleted user
     */
    async deleteApiUser(userId: number | null) {
        if (this.tasklist().length === 0) {
            await this.fetchTasks();
        }
        if (userId) {
            const tasksWithUser = this.tasklist().filter((task) => task.user_ids.includes(userId));
            for (const task of tasksWithUser) {
                const index = task.user_ids.indexOf(userId);
                task.user_ids.splice(index, 1);
                this.editApiTask(new Task(task));
            }
        }
    }
}
