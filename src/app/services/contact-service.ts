import { Service, signal, inject, computed } from '@angular/core';
import { IUser } from '../interfaces/iuser';
import { User } from '../components/models/user';
import { Toast, ToastType } from './toast';
import { SupabaseService } from './supabase';
import { TasksService } from './tasks-service';

@Service()
export class ContactService {
    supabase = inject(SupabaseService).supabase;
    toastService = inject(Toast);
    taskService = inject(TasksService);
    userList: IUser[] = [];

    users = signal<IUser[]>([]);
    selectedUserID = signal<number | null>(null);

    constructor() {
        this.getUsers();
    }

    ngOnDestroy() {
        this.supabase.removeChannel(this.channelUserInsert);
        this.supabase.removeChannel(this.channelUserUpdate);
        this.supabase.removeChannel(this.channelUserDelete);
    }

    sortUsers() {
        if (!this.userList) {
            return;
        }
        this.userList.sort((a, b) => a.name.localeCompare(b.name));
    }

    has<UserKey extends keyof IUser>(key: UserKey, value: IUser[UserKey]) {
        console.log("Checking", value, "for", key, "is", this.userList.some(user => user[key] === value));
        return this.userList.some(user => user[key] === value);
    }

    readonly groupedUsers = computed(() => {
        const userMap = new Map<string, IUser[]>();
        for (const user of this.userList) {
            const firstLetter = user.name.charAt(0).toUpperCase();
            if (!userMap.has(firstLetter)) {
                userMap.set(firstLetter, []);
            }
            userMap.get(firstLetter)?.push(user);
        }
        return userMap;
    });

    channelUserInsert = this.supabase
        .channel('use-insert-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user' }, (payload) => {
            this.users.update((list) => [...list, new User(payload.new)]);
            this.toastService.showToast('Contact succesfully created', ToastType.insertContact);
        })
        .subscribe();

    channelUserUpdate = this.supabase
        .channel('user-update-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user' }, (payload) => {
            this.users.update((list) =>
                list.map((user) => (user.id === payload.new['id'] ? { ...user, ...payload.new } : user))
            );
            this.toastService.showToast('Contact succesfully updated', ToastType.updateContact);
        })
        .subscribe();

    channelUserDelete = this.supabase
        .channel('user-delete-channel')
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'user' }, (payload) => {
            this.users.update((list) => list.filter((user) => user.id != payload.old['id']));
            this.toastService.showToast('Contact succesfully deleted', ToastType.deleteContact);
        })
        .subscribe();

    async getUsers() {
        let { data: user, error } = await this.supabase.from('user').select('*');
        if (!user) return;
        this.users.set(user);
        this.userList = this.users();
        this.sortUsers();
    }

    async addUser(user: User) {
        this.toastService.setTypeMatch(ToastType.insertContact);
        const userData = user.getCleanAddJson();
        const { data, error } = await this.supabase.from('user').insert([userData]).select();
        return data?.[0];
    }

    async deleteUser(id: number | null) {
        this.toastService.setTypeMatch(ToastType.deleteContact);
        this.taskService.deleteUser(id);
        const response = await this.supabase.from('user').delete().eq('id', id);
    }

    async editUser(user: User) {
        this.toastService.setTypeMatch(ToastType.updateContact);
        const userData = user.getCleanAddJson();
        const { data, error } = await this.supabase.from('user').update([userData]).eq('id', user.id).select();
    }
}
