import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Cal.com webhook received:", JSON.stringify(payload));

    const triggerEvent = payload.triggerEvent;

    // Handle both BOOKING_REQUESTED (needs approval) and BOOKING_CREATED (auto-approved)
    if (triggerEvent !== "BOOKING_CREATED" && triggerEvent !== "BOOKING_REQUESTED") {
      return new Response(JSON.stringify({ message: "Event ignored", triggerEvent }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const booking = payload.payload;

    const attendee = booking?.attendees?.[0];
    if (!attendee) {
      console.error("No attendee found in booking payload");
      return new Response(JSON.stringify({ error: "No attendee in payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = attendee.name || "Unknown";
    const email = attendee.email || "";
    const phone = attendee.phone || attendee.phoneNumber || booking?.responses?.attendeePhoneNumber?.value || booking?.responses?.phone?.value || null;
    const bookingUid = booking?.uid || "";
    const requiresConfirmation = booking?.requiresConfirmation || false;

    const eventTitle = booking?.title || booking?.eventTitle || "Cal.com Meeting";
    const startTime = booking?.startTime
      ? new Date(booking.startTime).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
      : "TBC";
    const endTime = booking?.endTime
      ? new Date(booking.endTime).toLocaleString("en-GB", { timeStyle: "short" })
      : "";

    const notes = booking?.responses?.notes?.value || booking?.description || "";
    const org = booking?.responses?.Org?.value || booking?.userFieldsResponses?.Org?.value || "";
    const budget = booking?.responses?.budget?.value || booking?.userFieldsResponses?.budget?.value || "";
    const budgetStr = Array.isArray(budget) ? budget.join(", ") : budget;

    const message = [
      `📅 Meeting booked: ${eventTitle}`,
      `Date: ${startTime}${endTime ? ` – ${endTime}` : ""}`,
      org ? `Organisation: ${org}` : "",
      budgetStr ? `Budget: ${budgetStr}` : "",
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Insert into inquiries
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("inquiries").insert({
      name,
      email,
      phone,
      message,
      budget: budgetStr || null,
      type: "cal_booking",
      source_page: "/book-a-call",
    });

    if (error) {
      console.error("Failed to insert inquiry:", error);
    }

    // Send Slack notification
    // Use Bot API for interactive messages, webhook for simple ones
    const isRequested = triggerEvent === "BOOKING_REQUESTED";
    const SLACK_BOT_TOKEN = Deno.env.get("SLACK_BOT_TOKEN");
    const SLACK_LEADS_CHANNEL_ID = "C050700QNLV";
    const SLACK_WEBHOOK_URL = Deno.env.get("SLACK_WEBHOOK_URL");

    if (SLACK_BOT_TOKEN && SLACK_CHANNEL_ID || SLACK_WEBHOOK_URL) {
      try {
        const slackBlocks: any[] = [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: isRequested ? "📅 New Booking Request (Pending Approval)" : "📅 New Cal.com Booking",
              emoji: true,
            },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Name:*\n${name}` },
              { type: "mrkdwn", text: `*Email:*\n${email}` },
            ],
          },
        ];

        if (phone) {
          slackBlocks.push({
            type: "section",
            fields: [{ type: "mrkdwn", text: `*Phone:*\n${phone}` }],
          });
        }

        if (org) {
          slackBlocks.push({
            type: "section",
            fields: [{ type: "mrkdwn", text: `*Organisation:*\n${org}` }],
          });
        }

        slackBlocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Meeting:*\n${eventTitle}\n${startTime}${endTime ? ` – ${endTime}` : ""}`,
          },
        });

        if (budgetStr) {
          slackBlocks.push({
            type: "section",
            fields: [{ type: "mrkdwn", text: `*Budget:*\n${budgetStr}` }],
          });
        }

        if (notes) {
          slackBlocks.push({
            type: "section",
            text: { type: "mrkdwn", text: `*Notes:*\n${notes}` },
          });
        }

        // Add approve/decline buttons for bookings requiring confirmation
        if (isRequested && bookingUid) {
          slackBlocks.push({
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "✅ Approve", emoji: true },
                style: "primary",
                action_id: `approve_booking:${bookingUid}`,
              },
              {
                type: "button",
                text: { type: "plain_text", text: "❌ Decline", emoji: true },
                style: "danger",
                action_id: `decline_booking:${bookingUid}`,
              },
            ],
          });
        }

        slackBlocks.push({
          type: "context",
          elements: [
            { type: "mrkdwn", text: `Booked via Cal.com at ${new Date().toISOString()}` },
          ],
        });

        // Use Bot API when we have interactive buttons, webhook otherwise
        if (isRequested && bookingUid && SLACK_BOT_TOKEN && SLACK_CHANNEL_ID) {
          const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channel: SLACK_CHANNEL_ID,
              blocks: slackBlocks,
              text: `📅 New booking request from ${name} (${email})`,
            }),
          });

          const slackData = await slackRes.json();
          if (!slackData.ok) {
            console.error("Slack Bot API failed:", slackData.error);
          }
        } else if (SLACK_WEBHOOK_URL) {
          const slackRes = await fetch(SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blocks: slackBlocks }),
          });

          if (!slackRes.ok) {
            console.error("Slack webhook failed:", await slackRes.text());
          }
        }
      } catch (slackErr) {
        console.error("Failed to send Slack notification:", slackErr);
      }
    }

    console.log(`Booking inquiry created for ${email} (event: ${triggerEvent})`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
