// supabase/functions/profile-upsert/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabaseClient.ts';

type Payload = {
  full_name: string;
  nickname: string;
  dob: string; // YYYY-MM-DD
  gender: 'male' | 'female' | 'other';
  bio?: string;
  photos: string[]; // expect 4 URIs
  interests?: Record<string, unknown>;
  mode: 'mystery' | 'normal';
};

function isValidDate(d: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d);
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing bearer token' }), { status: 401 });
    }

    const body: Payload = await req.json();

    if (!body.full_name?.trim() || !body.nickname?.trim()) {
      return new Response(JSON.stringify({ error: 'full_name and nickname are required' }), { status: 400 });
    }
    if (!isValidDate(body.dob)) {
      return new Response(JSON.stringify({ error: 'dob must be YYYY-MM-DD' }), { status: 400 });
    }
    if (!['male', 'female', 'other'].includes(body.gender)) {
      return new Response(JSON.stringify({ error: 'invalid gender' }), { status: 400 });
    }
    if (!['mystery', 'normal'].includes(body.mode)) {
      return new Response(JSON.stringify({ error: 'invalid mode' }), { status: 400 });
    }
    if (!Array.isArray(body.photos) || body.photos.length !== 4 || body.photos.some(p => typeof p !== 'string' || p.length === 0)) {
      return new Response(JSON.stringify({ error: 'photos must be an array of 4 non-empty strings' }), { status: 400 });
    }

    // Validate user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const userId = userData.user.id;

    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        full_name: body.full_name,
        nickname: body.nickname,
        dob: body.dob,
        gender: body.gender,
        bio: body.bio ?? '',
        photos: body.photos,
        interests: body.interests ?? {},
        mode: body.mode,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});
