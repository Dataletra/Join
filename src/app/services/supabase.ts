import { Service, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { IUser } from '../interfaces/iuser';

@Service()
export class Supabase {
    supabaseUrl = 'https://svbomumezskcpinnsucj.supabase.co';
    supabaseKey = 'sb_publishable_ND6SqwGZ7zK_2fLUPQz6PA_HtaQvgDb';
    supabase = createClient(this.supabaseUrl, this.supabaseKey);

    users = signal<IUser[]>([]);
    selectedUserID = signal<number | null>(null);

    async getUsers() {
        let { data: user, error } = await this.supabase.from('user').select('*');
        if (!user) return;
        this.users.set(user);
    }
}
