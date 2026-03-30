import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SLACK_BOT_TOKEN = Deno.env.get("SLACK_BOT_TOKEN");
    const SLACK_CHANNEL_ID = Deno.env.get("SLACK_CHANNEL_ID");
    
    if (!SLACK_BOT_TOKEN) {
      return new Response(
        JSON.stringify({ error: "SLACK_BOT_TOKEN not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!SLACK_CHANNEL_ID) {
      return new Response(
        JSON.stringify({ error: "SLACK_CHANNEL_ID not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { ideas } = await req.json();
    if (!ideas || !Array.isArray(ideas) || ideas.length === 0) {
      return new Response(
        JSON.stringify({ error: "No ideas provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build Slack blocks
    const blocks: any[] = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🎙️ New Content Ideas",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${ideas.length} new podcast industry content ideas have been found. Approve to generate a blog post, or decline to remove.`,
        },
      },
      { type: "divider" },
    ];

    for (const idea of ideas) {
      const sourceText = idea.source_url
        ? `<${idea.source_url}|View source>`
        : idea.source || "Research";

      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${idea.title}*\n${idea.description || "No description"}\n_Source: ${sourceText}_`,
        },
      });

      blocks.push({
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "✅ Approve", emoji: true },
            style: "primary",
            action_id: `approve_idea:${idea.id}`,
            value: idea.id,
          },
          {
            type: "button",
            text: { type: "plain_text", text: "❌ Decline", emoji: true },
            style: "danger",
            action_id: `decline_idea:${idea.id}`,
            value: idea.id,
          },
        ],
      });

      blocks.push({ type: "divider" });
    }

    // Send to Slack
    const slackResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL_ID,
        text: `🎙️ ${ideas.length} new content ideas ready for review`,
        blocks,
      }),
    });

    const slackData = await slackResponse.json();
    if (!slackData.ok) {
      console.error("Slack API error:", slackData.error);
      return new Response(
        JSON.stringify({ error: `Slack error: ${slackData.error}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("slack-notify-ideas error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
