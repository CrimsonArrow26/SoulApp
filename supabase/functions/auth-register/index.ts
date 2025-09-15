// supabase/functions/auth-register/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAnonClient, supabaseAdmin } from '../_shared/supabaseClient.ts';

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

    if (!email || !password || password.length < 6) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 400 });
    }

    const anon = createAnonClient();

    // Sign up user
    const { data, error } = await anon.auth.signUp({ email, password });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    const userId = data.user?.id;

    // Create empty profile row to reserve id (optional)
    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .insert({ id: userId, full_name: '', nickname: '', photos: [], interests: {}, mode: 'normal' })
        .onConflict('id');
    }

    return new Response(JSON.stringify({ user: data.user, session: data.session }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});


