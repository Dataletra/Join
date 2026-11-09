import { Service } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
@Service()
export class SupabaseService {
    supabaseUrl = 'https://svbomumezskcpinnsucj.supabase.co';
    supabaseKey = environment.SERVICE_KEY;

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
