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
    shouldScrollToSelectedUser = signal<boolean>(false);

    /**
     * Fetch and sort users.
     */
    constructor() {
        this.getUsers();
    }

    /**
     * Remove channel subscribtions.
     */
    ngOnDestroy() {
        this.supabase.removeChannel(this.channelUserInsert);
        this.supabase.removeChannel(this.channelUserUpdate);
        this.supabase.removeChannel(this.channelUserDelete);
    }

    /**
     * Sort users alphabetically.
     * @returns void
     */
    sortUsers() {
        if (!this.userList) {
            return;
        }
        this.userList.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Search the user list for at least one matching key-value pair. E.g. .has('email', value)
     * @param key - key of type IUser
     * @param value - value to search for
     * @returns boolean - true if this value exists for given key
     */
    has<UserKey extends keyof IUser>(key: UserKey, value: IUser[UserKey]) {
        return this.userList.some((user) => user[key] === value);
    }

    /**
     * Search the user list for at least one matching key-value pair and return this user. E.g. .get('email', value)
     * @param key - key of type IUser
     * @param value - value to search for
     * @returns IUser | undefined - valid IUser or undefined if no match has been found
     */
    get<UserKey extends keyof IUser>(key: UserKey, value: IUser[UserKey]) {
        return this.userList.find((user) => user[key] === value);
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

    /**
     * Get User from API, or null if email does not exist
     * @param email {string} email
     * @returns {Promise<IUser | null>} - User from API, or null if email does not exist.
     */
    async getUserByApiEmail(email: string): Promise<IUser | null> {
        let { data: user, error } = await this.supabase.from('user').select('*').eq('email', email).maybeSingle();
        return user && !error ? (user as IUser) : null;
    }

    /**
     * Get User from API, or null if uid does not exist
     * @param uid {string} uid
     * @returns {Promise<IUser | null>} - User from API, or null if uid does not exist.
     */
    async getUserByApiUid(uid: string): Promise<IUser | null> {
        let { data: user, error } = await this.supabase.from('user').select('*').eq('uid', uid).maybeSingle();
        return user && !error ? (user as IUser) : null;
    }

    /**
     * Fetch all users.
     * @returns void
     */
    async getUsers() {
        let { data: user, error } = await this.supabase.from('user').select('*');
        if (!user) return;
        this.users.set(user);
        this.userList = this.users();
        this.sortUsers();
    }

    /**
     * Upload a user to databank.
     * @param user {User} - User to add to Supabase.
     * @param showToast {boolean} - show toast message, if possible.
     * @returns userid
     */
    async addUser(user: User, showToast: boolean = false) {
        if (showToast) {
            this.toastService.setTypeMatch(ToastType.insertContact);
        }
        const userData = user.getCleanAddJson();
        const { data, error } = await this.supabase.from('user').insert([userData]).select();
        return data?.[0];
    }

    /**
     * Delete User from databank.
     * @param id {number | null} - user id to delete.
     */
    async deleteApiUser(id: number | null) {
        this.toastService.setTypeMatch(ToastType.deleteContact);
        this.taskService.deleteApiUser(id);
        const response = await this.supabase.from('user').delete().eq('id', id);
    }

    /**
     * Delete Authenticated user (currently logged in user) from databank.
     * @param id {number | null} - user id to delete.
     * @returns attempt to delete signed in user
     */
    async deleteAuthUser(id: number | null): Promise<boolean> {
        const pendingDeletion = this.userList.find((entry) => entry.id === id);
        if (pendingDeletion == undefined || !pendingDeletion.uid) {
            return false;
        }

        this.toastService.setTypeMatch(ToastType.deleteContact);

        // Call your secure Supabase Edge Function
        const { data, error } = await this.supabase.functions.invoke('delete-auth-user', {
            body: { userId: pendingDeletion.uid },
        });

        if (error) {
            return false;
        }
		return true;
    }

    /**
     * Edit User on databank.
     * @param user {User} - user to be updated.
     * @param showToast {boolean} - show toast message, if possible.
     */
    async editUser(user: User, showToast: boolean = false) {
        if (showToast) {
            this.toastService.setTypeMatch(ToastType.updateContact);
        }
        const userData = user.getCleanAddJson();
        const { data, error } = await this.supabase.from('user').update([userData]).eq('id', user.id).select();
    }
}
