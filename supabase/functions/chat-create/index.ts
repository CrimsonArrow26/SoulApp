// supabase/functions/chat-create/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabaseClient.ts';

type Payload = {
  otherUserId?: string; // For normal mode - specific user
  mode: 'mystery' | 'normal';
};

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

    if (!['mystery', 'normal'].includes(body.mode)) {
      return new Response(JSON.stringify({ error: 'Invalid mode' }), { status: 400 });
    }

    // Validate user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const userId = userData.user.id;

    if (body.mode === 'normal' && !body.otherUserId) {
      return new Response(JSON.stringify({ error: 'otherUserId required for normal mode' }), { status: 400 });
    }

    // Check if chat already exists
    let existingChat = null;
    if (body.mode === 'normal' && body.otherUserId) {
      const { data: existing } = await supabaseAdmin
        .from('chats')
        .select(`
          id,
          chat_members!inner(user_id)
        `)
        .eq('mode', 'normal')
        .in('chat_members.user_id', [userId, body.otherUserId])
        .limit(1);

      if (existing && existing.length > 0) {
        // Check if both users are in this chat
        const chatMembers = existing[0].chat_members;
        const userIds = chatMembers.map((m: any) => m.user_id);
        if (userIds.includes(userId) && userIds.includes(body.otherUserId)) {
          existingChat = existing[0];
        }
      }
    }

    if (existingChat) {
      return new Response(JSON.stringify({ chat: existingChat }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Create new chat
    const { data: chat, error: chatError } = await supabaseAdmin
      .from('chats')
      .insert({
        mode: body.mode,
        status: 'active',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (chatError) {
      return new Response(JSON.stringify({ error: chatError.message }), { status: 400 });
    }

    // Add chat members
    const members = [userId];
    if (body.mode === 'normal' && body.otherUserId) {
      members.push(body.otherUserId);
    } else if (body.mode === 'mystery') {
      // For mystery mode, find a random available user
      const { data: availableUsers } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('mode', 'mystery')
        .neq('id', userId)
        .limit(10);

      if (availableUsers && availableUsers.length > 0) {
        const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        members.push(randomUser.id);
      }
    }

    const { error: membersError } = await supabaseAdmin
      .from('chat_members')
      .insert(members.map(userId => ({
        chat_id: chat.id,
        user_id: userId,
        joined_at: new Date().toISOString(),
      })));

    if (membersError) {
      return new Response(JSON.stringify({ error: membersError.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ chat }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});
