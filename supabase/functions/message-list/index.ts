// supabase/functions/message-list/index.ts
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
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    if (!chatId) {
      return new Response(JSON.stringify({ error: 'chat_id parameter required' }), { status: 400 });
    }

    // Validate user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const userId = userData.user.id;

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

    // Get messages
    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    // Mark messages as read for this user
    if (messages && messages.length > 0) {
      await supabaseAdmin
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .neq('sender_id', userId)
        .is('read_at', null);
    }

    return new Response(JSON.stringify({ messages: messages || [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});
