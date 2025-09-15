// supabase/functions/auth-login/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAnonClient } from '../_shared/supabaseClient.ts';

type Payload = {
  email: string;
  password: string;
};

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const body: Payload = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 });
    }

    const anon = createAnonClient();
    const { data, error } = await anon.auth.signInWithPassword({ email, password });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 401 });
    }

    return new Response(JSON.stringify({ user: data.user, session: data.session }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});


