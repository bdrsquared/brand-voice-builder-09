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

    const [actionType, actionId] = action.action_id.split(":");
    if (!actionId) {
      return new Response("OK", { status: 200 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const userName = payload.user?.name || payload.user?.real_name || "Someone";

    // ── Blog idea actions ──
    if (actionType === "approve_idea" || actionType === "decline_idea") {
      if (actionType === "decline_idea") {
        await supabase.from("blog_ideas").delete().eq("id", actionId);

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
        await fetch(payload.response_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            replace_original: false,
            response_type: "in_channel",
            text: `✅ ${userName} approved this idea. Generating blog post now...`,
          }),
        });

        const generateUrl = `${supabaseUrl}/functions/v1/generate-blog-from-idea`;
        const genResponse = await fetch(generateUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
          },
          body: JSON.stringify({ idea_id: actionId }),
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
    }

    // ── Cal.com booking actions ──
    if (actionType === "approve_booking" || actionType === "decline_booking") {
      const CAL_API_KEY = Deno.env.get("CAL_API_KEY");
      if (!CAL_API_KEY) {
        await fetch(payload.response_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            replace_original: false,
            response_type: "in_channel",
            text: `⚠️ CAL_API_KEY not configured. Cannot process booking.`,
          }),
        });
        return new Response("OK", { status: 200 });
      }

      const bookingUid = actionId;

      if (actionType === "approve_booking") {
        // Confirm the booking via Cal.com API v2
        const calRes = await fetch(`https://api.cal.com/v2/bookings/${bookingUid}/confirm`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${CAL_API_KEY}`,
            "cal-api-version": "2024-08-13",
            "Content-Type": "application/json",
          },
        });

        const calData = await calRes.json();
        console.log("Cal.com confirm response:", JSON.stringify(calData));

        if (calRes.ok) {
          await fetch(payload.response_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              replace_original: false,
              response_type: "in_channel",
              text: `✅ ${userName} approved the booking. The attendee has been notified.`,
            }),
          });
        } else {
          await fetch(payload.response_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              replace_original: false,
              response_type: "in_channel",
              text: `⚠️ Failed to approve booking: ${calData?.error?.message || calData?.message || JSON.stringify(calData)}`,
            }),
          });
        }

        return new Response("OK", { status: 200 });
      }

      if (actionType === "decline_booking") {
        // Decline the booking via Cal.com API v2
        const calRes = await fetch(`https://api.cal.com/v2/bookings/${bookingUid}/decline`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${CAL_API_KEY}`,
            "cal-api-version": "2024-08-13",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: `Declined by ${userName} via Slack` }),
        });

        const calData = await calRes.json();
        console.log("Cal.com decline response:", JSON.stringify(calData));

        if (calRes.ok) {
          await fetch(payload.response_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              replace_original: false,
              response_type: "in_channel",
              text: `❌ ${userName} declined the booking. The attendee has been notified.`,
            }),
          });
        } else {
          await fetch(payload.response_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              replace_original: false,
              response_type: "in_channel",
              text: `⚠️ Failed to decline booking: ${calData?.error?.message || calData?.message || JSON.stringify(calData)}`,
            }),
          });
        }

        return new Response("OK", { status: 200 });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("slack-interaction error:", e);
    return new Response("Internal error", { status: 200 }); // Return 200 to Slack to avoid retries
  }
});
