// supabase/functions/chat-list/index.ts
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

    // Validate user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const userId = userData.user.id;

    // Get user's chats with other member info
    const { data: chats, error } = await supabaseAdmin
      .from('chats')
      .select(`
        id,
        mode,
        status,
        created_at,
        updated_at,
        chat_members!inner(
          user_id,
          joined_at,
          profiles!inner(
            id,
            nickname,
            photos,
            mode
          )
        )
      `)
      .eq('chat_members.user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    // Transform data to include other user info
    const transformedChats = chats?.map(chat => {
      const otherMember = chat.chat_members.find((member: any) => member.user_id !== userId);
      return {
        id: chat.id,
        mode: chat.mode,
        status: chat.status,
        created_at: chat.created_at,
        updated_at: chat.updated_at,
        other_user: otherMember ? {
          id: otherMember.profiles.id,
          nickname: otherMember.profiles.nickname,
          photos: otherMember.profiles.photos,
          mode: otherMember.profiles.mode,
        } : null,
      };
    }) || [];

    return new Response(JSON.stringify({ chats: transformedChats }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});
