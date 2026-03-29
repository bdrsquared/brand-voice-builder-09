import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SLACK_WEBHOOK_URL = Deno.env.get('SLACK_WEBHOOK_URL');
    if (!SLACK_WEBHOOK_URL) {
      throw new Error('SLACK_WEBHOOK_URL is not configured');
    }

    const body = await req.json();
    const { name, email, phone, message, budget, type } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 200) {
      return new Response(JSON.stringify({ error: 'Valid name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 320) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isContact = type === 'contact';

    if (isContact && (!message || typeof message !== 'string' || message.trim().length === 0)) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save to database using service role
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('inquiries').insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        message: message?.trim() || null,
        budget: budget || null,
        type: type || 'demo',
      });
    } catch (dbError) {
      console.error('Failed to save inquiry to database:', dbError);
      // Don't block the Slack notification if DB fails
    }

    const headerText = isContact ? "💬 New Website Message" : "🎙️ New PodPlanner Demo Request";

    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: headerText, emoji: true }
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Name:*\n${name.trim()}` },
            { type: "mrkdwn", text: `*Email:*\n${email.trim()}` },
          ]
        },
        ...(phone && phone.trim() ? [{
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Phone:*\n${phone.trim()}` },
          ]
        }] : []),
        ...(isContact && message ? [{
          type: "section",
          text: { type: "mrkdwn", text: `*Message:*\n${message.trim()}` }
        }] : []),
        ...(budget ? [{
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Budget:*\n${budget}` },
          ]
        }] : []),
        {
          type: "context",
          elements: [
            { type: "mrkdwn", text: `Submitted via earworm.co at ${new Date().toISOString()}` }
          ]
        }
      ]
    };

    const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage),
    });

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text();
      throw new Error(`Slack API call failed [${slackResponse.status}]: ${errorText}`);
    }

    await slackResponse.text();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending demo request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
