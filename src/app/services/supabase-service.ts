import { Service } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Service()
export class SupabaseService {
    supabaseUrl = 'https://svbomumezskcpinnsucj.supabase.co';
    supabaseKey = 'sb_publishable_ND6SqwGZ7zK_2fLUPQz6PA_HtaQvgDb';
    supabase = createClient(this.supabaseUrl, this.supabaseKey);
}
