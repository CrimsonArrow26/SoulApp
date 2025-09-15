// supabase/functions/insight-list/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabaseClient.ts';

serve(async (req) => {
  try {
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing bearer token' }), { status: 401 });
    }

    const url = new URL(req.url);
    const chatId = url.searchParams.get('chat_id');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Validate user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const userId = userData.user.id;

    let query = supabaseAdmin
      .from('insights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (chatId) {
      // Verify user is member of this chat
      const { data: membership, error: membershipError } = await supabaseAdmin
        .from('chat_members')
        .select('chat_id')
        .eq('chat_id', chatId)
        .eq('user_id', userId)
        .single();

      if (membershipError || !membership) {
        return new Response(JSON.stringify({ error: 'Not a member of this chat' }), { status: 403 });
      }

      query = query.eq('chat_id', chatId);
    } else {
      // Get insights for all user's chats
      const { data: userChats } = await supabaseAdmin
        .from('chat_members')
        .select('chat_id')
        .eq('user_id', userId);

      if (userChats && userChats.length > 0) {
        const chatIds = userChats.map(chat => chat.chat_id);
        query = query.in('chat_id', chatIds);
      } else {
        return new Response(JSON.stringify({ insights: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    const { data: insights, error } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ insights: insights || [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});
