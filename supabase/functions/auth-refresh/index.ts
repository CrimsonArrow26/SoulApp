// supabase/functions/auth-refresh/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAnonClient } from '../_shared/supabaseClient.ts';

type Payload = {
  refresh_token: string;
};

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const body: Payload = await req.json();
    if (!body.refresh_token) {
      return new Response(JSON.stringify({ error: 'refresh_token required' }), { status: 400 });
    }

    const anon = createAnonClient();
    const { data, error } = await anon.auth.refreshSession({ refresh_token: body.refresh_token });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 401 });
    }

    return new Response(JSON.stringify({ user: data.user, session: data.session }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});


