import { Service, signal, inject, computed } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { IUser } from '../interfaces/iuser';
import { User } from '../components/models/user';
import { Toast } from './toast';

@Service()
export class ContactService {
    supabaseUrl = 'https://svbomumezskcpinnsucj.supabase.co';
    supabaseKey = 'sb_publishable_ND6SqwGZ7zK_2fLUPQz6PA_HtaQvgDb';
    supabase = createClient(this.supabaseUrl, this.supabaseKey);
    toastService = inject(Toast);

    users = signal<IUser[]>([]);
    selectedUserID = signal<number | null>(null);

    constructor() {
        this.getUsers();
    }

    readonly groupedUsers = computed(() => {
        const userMap = new Map<string, IUser[]>();
        for (const user of this.users()) {
            const firstLetter = user.name.charAt(0).toUpperCase();
            if (!userMap.has(firstLetter)) {
                userMap.set(firstLetter, []);
            }
            userMap.get(firstLetter)?.push(user);
        }
        return userMap;
    });

    channelUserInsert = this.supabase
        .channel('custom-insert-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user' }, (payload) => {
            this.users.update((list) => [...list, new User(payload.new)]);
            this.toastService.showToast('Contact succesfully created');
        })
        .subscribe();

    channelUserUpdate = this.supabase
        .channel('custom-update-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user' }, (payload) => {
            this.users.update((list) =>
                list.map((user) => (user.id === payload.new['id'] ? { ...user, ...payload.new } : user))
            );
            this.toastService.showToast('Contact succesfully updated');
        })
        .subscribe();

    channelUserDelete = this.supabase
        .channel('custom-delete-channel')
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'user' }, (payload) => {
            this.users.update((list) => list.filter((user) => user.id != payload.old['id']));
            this.toastService.showToast('Contact succesfully deleted');
        })
        .subscribe();

    async getUsers() {
        let { data: user, error } = await this.supabase.from('user').select('*');
        if (!user) return;
        this.users.set(user);
    }

    async addUser(user: User) {
        const userData = user.getCleanAddJson();
        const { data, error } = await this.supabase.from('user').insert([userData]).select();
    }

    async deleteUser(id: number | null) {
        const response = await this.supabase.from('user').delete().eq('id', id);
    }

    async editUser(user: User) {
        const userData = user.getCleanAddJson();
        const { data, error } = await this.supabase.from('user').update([userData]).eq('id', user.id).select();
    }

    ngOnDestroy() {
        this.supabase.removeChannel(this.channelUserInsert);
        this.supabase.removeChannel(this.channelUserUpdate);
        this.supabase.removeChannel(this.channelUserDelete);
    }
}
