// supabase/functions/insight-generate/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabaseClient.ts';

type Payload = {
  chat_id: string;
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

    if (!body.chat_id?.trim()) {
      return new Response(JSON.stringify({ error: 'chat_id is required' }), { status: 400 });
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

    // Get recent messages for analysis
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('chat_id', body.chat_id)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (messagesError) {
      return new Response(JSON.stringify({ error: messagesError.message }), { status: 400 });
    }

    if (!messages || messages.length < 5) {
      return new Response(JSON.stringify({ error: 'Not enough messages to generate insights' }), { status: 400 });
    }

    // Simple demo insight generation (replace with real AI analysis)
    const totalMessages = messages.length;
    const avgMessageLength = Math.round(messages.reduce((sum, msg) => sum + msg.content.length, 0) / totalMessages);
    const avgResponseTime = Math.round(messages.reduce((sum, msg) => sum + (msg.typing_duration || 0), 0) / totalMessages);
    
    // Calculate engagement score based on message frequency and length
    const engagementScore = Math.min(100, Math.round((totalMessages * 2) + (avgMessageLength / 2)));
    
    // Calculate compatibility score (demo logic)
    const compatibilityScore = Math.min(100, Math.round(engagementScore * 0.8 + Math.random() * 20));
    
    // Generate demo insights
    const insights = [
      `You've exchanged ${totalMessages} messages, showing strong engagement`,
      `Average message length of ${avgMessageLength} characters indicates thoughtful communication`,
      `Response patterns suggest ${avgResponseTime > 5000 ? 'careful consideration' : 'quick, natural flow'}`,
    ];

    if (avgMessageLength > 50) {
      insights.push('Your detailed responses show genuine interest in the conversation');
    }
    if (totalMessages > 20) {
      insights.push('The conversation length indicates mutual compatibility');
    }

    // Create insight record
    const { data: insight, error: insightError } = await supabaseAdmin
      .from('insights')
      .insert({
        chat_id: body.chat_id,
        engagement_score: engagementScore,
        emotional_tone: 'positive', // Demo value
        response_time: avgResponseTime,
        message_length: avgMessageLength,
        edit_frequency: 0.1, // Demo value
        compatibility_score: compatibilityScore,
        insights: insights,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insightError) {
      return new Response(JSON.stringify({ error: insightError.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ insight }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
});
