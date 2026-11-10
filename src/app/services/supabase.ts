import { Service } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Service()
export class SupabaseService {
    supabaseUrl = 'https://svbomumezskcpinnsucj.supabase.co';
    supabaseKey = 'sb_publishable_ND6SqwGZ7zK_2fLUPQz6PA_HtaQvgDb';

    /**
     * Supabase client.
     */
    supabase = createClient(this.supabaseUrl, this.supabaseKey);

    /**
     * Temporary session client used for sign-up.
     */
    signUp = createClient(this.supabaseUrl, this.supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
            storageKey: 'supabase-signup-auth',
        },
    });
}
