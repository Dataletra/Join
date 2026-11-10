import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { userId } = await req.json();

        const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}');

        const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', secretKeys['default'], {
            auth: { persistSession: false },
        });

        const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
