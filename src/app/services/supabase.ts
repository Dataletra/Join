import { Service, signal } from '@angular/core';
import { email } from '@angular/forms/signals';
import { createClient } from '@supabase/supabase-js';
import { Iuser } from '../interfaces/iuser';

@Service()
export class Supabase {
    supabaseUrl = 'https://svbomumezskcpinnsucj.supabase.co';
    supabaseKey = 'sb_publishable_ND6SqwGZ7zK_2fLUPQz6PA_HtaQvgDb';
    supabase = createClient(this.supabaseUrl, this.supabaseKey);

    users = signal<Iuser[]>([]);

    async getUsers() {
        let { data: user, error } = await this.supabase.from('user').select('*');
        if (!user) return;
        this.users.set(user);
    }
}
