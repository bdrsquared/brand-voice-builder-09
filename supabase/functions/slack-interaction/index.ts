import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    if (!SLACK_BOT_TOKEN) {
      return new Response("SLACK_BOT_TOKEN not configured", { status: 500 });
    }

    // Slack sends interaction payloads as application/x-www-form-urlencoded
    const formData = await req.formData();
    const payloadStr = formData.get("payload");
    if (!payloadStr) {
      return new Response("No payload", { status: 400 });
    }

    const payload = JSON.parse(payloadStr as string);
    
    if (payload.type !== "block_actions") {
      return new Response("OK", { status: 200 });
    }

    const action = payload.actions?.[0];
    if (!action) {
      return new Response("OK", { status: 200 });
    }

    const [actionType, ideaId] = action.action_id.split(":");
    if (!ideaId || (actionType !== "approve_idea" && actionType !== "decline_idea")) {
      return new Response("OK", { status: 200 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const userName = payload.user?.name || payload.user?.real_name || "Someone";

    if (actionType === "decline_idea") {
      // Delete the idea
      await supabase.from("blog_ideas").delete().eq("id", ideaId);

      // Update Slack message
      await fetch(payload.response_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replace_original: false,
          response_type: "in_channel",
          text: `❌ ${userName} declined this idea. It has been removed.`,
        }),
      });

      return new Response("OK", { status: 200 });
    }

    if (actionType === "approve_idea") {
      // Update Slack message immediately to show it's processing
      await fetch(payload.response_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replace_original: false,
          response_type: "in_channel",
          text: `✅ ${userName} approved this idea. Generating blog post now...`,
        }),
      });

      // Call generate-blog-from-idea
      const generateUrl = `${supabaseUrl}/functions/v1/generate-blog-from-idea`;
      const genResponse = await fetch(generateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ idea_id: ideaId }),
      });

      const genResult = await genResponse.json();

      if (genResponse.ok && genResult.success) {
        await fetch(payload.response_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            replace_original: false,
            response_type: "in_channel",
            text: `📝 Blog draft created: *${genResult.post?.title || "New post"}* - saved as draft.`,
          }),
        });
      } else {
        await fetch(payload.response_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            replace_original: false,
            response_type: "in_channel",
            text: `⚠️ Blog generation failed: ${genResult.error || "Unknown error"}. You can retry from the admin panel.`,
          }),
        });
      }

      return new Response("OK", { status: 200 });
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("slack-interaction error:", e);
    return new Response("Internal error", { status: 200 }); // Return 200 to Slack to avoid retries
  }
});
