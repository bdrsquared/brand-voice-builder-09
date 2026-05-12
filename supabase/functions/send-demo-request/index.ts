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
    const { name, email, phone, message, budget, type, source_page } = body;

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
        source_page: source_page || null,
      });
    } catch (dbError) {
      console.error('Failed to save inquiry to database:', dbError);
      // Don't block the Slack notification if DB fails
    }

    // Sync to Pipedrive (non-blocking — don't fail the whole request if it errors)
    try {
      const PIPEDRIVE_API_TOKEN = Deno.env.get('PIPEDRIVE_API_TOKEN');
      const PIPEDRIVE_DOMAIN = 'earwormagency';
      if (PIPEDRIVE_API_TOKEN) {
        const pdBase = `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v2`;
        const auth = `api_token=${PIPEDRIVE_API_TOKEN}`;

        // 1. Find existing person by email
        const searchRes = await fetch(
          `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v2/persons/search?term=${encodeURIComponent(email.trim())}&fields=email&exact_match=true&${auth}`
        );
        const searchData = await searchRes.json();
        let personId: number | null = searchData?.data?.items?.[0]?.item?.id ?? null;

        // 2. Create person if not found
        if (!personId) {
          const personRes = await fetch(`${pdBase}/persons?${auth}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name.trim(),
              emails: [{ value: email.trim(), primary: true, label: 'work' }],
              ...(phone && phone.trim() ? { phones: [{ value: phone.trim(), primary: true, label: 'work' }] } : {}),
            }),
          });
          const personData = await personRes.json();
          personId = personData?.data?.id ?? null;
        }

        if (personId) {
          // 3. Create Lead in Leads Inbox
          const typeLabel = type === 'playbook' ? 'Content Playbook download'
            : type === 'playpack' ? 'Play Pack request'
            : type === 'guest_booking' ? 'Podcast booking request'
            : type === 'contact' ? 'Website message'
            : 'PodPlanner demo request';

          const leadRes = await fetch(`https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/leads?${auth}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `${typeLabel} - ${name.trim()}`,
              person_id: personId,
            }),
          });
          const leadData = await leadRes.json();
          const leadId = leadData?.data?.id ?? null;

          // 4. Attach note with all submission context
          const noteLines = [
            `Source: ${typeLabel}`,
            source_page ? `Page: ${source_page}` : null,
            budget ? `Budget: ${budget}` : null,
            phone ? `Phone: ${phone.trim()}` : null,
            message ? `\nMessage:\n${message.trim()}` : null,
          ].filter(Boolean).join('\n');

          if (noteLines) {
            await fetch(`https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/notes?${auth}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: noteLines.replace(/\n/g, '<br>'),
                person_id: personId,
                ...(leadId ? { lead_id: leadId } : {}),
              }),
            });
          }
        }
      }
    } catch (pdError) {
      console.error('Failed to sync to Pipedrive:', pdError);
      // Non-blocking — Slack + DB still proceed
    }

    const isPlayPack = type === 'playpack';
    const isPlaybook = type === 'playbook';
    const isGuestBooking = type === 'guest_booking';
    const headerText = isPlaybook ? "📄 New Content Playbook Download" : isPlayPack ? "📦 Play Pack Request" : isGuestBooking ? "🎤 New Podcast Booking Request" : isContact ? "💬 New Website Message" : "🎙️ New PodPlanner Demo Request";

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
        ...((isContact || isGuestBooking) && message ? [{
          type: "section",
          text: { type: "mrkdwn", text: `*Message:*\n${message.trim()}` }
        }] : []),
        ...(budget ? [{
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Budget:*\n${budget}` },
          ]
        }] : []),
        ...(source_page ? [{
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Source Page:*\n${source_page}` },
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
