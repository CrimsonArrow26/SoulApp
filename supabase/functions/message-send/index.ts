// supabase/functions/message-send/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabaseClient.ts';

type Payload = {
  chat_id: string;
  content: string;
  typing_duration?: number;
  pause_before_send?: number;
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

    if (!body.chat_id?.trim() || !body.content?.trim()) {
      return new Response(JSON.stringify({ error: 'chat_id and content are required' }), { status: 400 });
    }

    if (body.content.length > 1000) {
      return new Response(JSON.stringify({ error: 'Message too long (max 1000 chars)' }), { status: 400 });
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
      .eq('chat_id', body.chat_id)
      .eq('user_id', userId)
      .single();

    if (membershipError || !membership) {
      return new Response(JSON.stringify({ error: 'Not a member of this chat' }), { status: 403 });
    }

    // Create message
    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .insert({
        chat_id: body.chat_id,
        sender_id: userId,
        content: body.content.trim(),
        timestamp: new Date().toISOString(),
        typing_duration: body.typing_duration || null,
        pause_before_send: body.pause_before_send || null,
      })
      .select()
      .single();

    if (messageError) {
      return new Response(JSON.stringify({ error: messageError.message }), { status: 400 });
    }

    // Update chat's updated_at timestamp
    await supabaseAdmin
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', body.chat_id);

    return new Response(JSON.stringify({ message }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});
