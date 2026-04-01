import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.4/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Cal.com webhook received:", JSON.stringify(payload));

    const triggerEvent = payload.triggerEvent;

    // Only process booking created events
    if (triggerEvent !== "BOOKING_CREATED") {
      return new Response(JSON.stringify({ message: "Event ignored", triggerEvent }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const booking = payload.payload;

    // Extract attendee info (first attendee is typically the booker)
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
    const phone = attendee.phone || booking?.responses?.phone?.value || null;

    // Build a descriptive message from booking details
    const eventTitle = booking?.title || booking?.eventTitle || "Cal.com Meeting";
    const startTime = booking?.startTime
      ? new Date(booking.startTime).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
      : "TBC";
    const endTime = booking?.endTime
      ? new Date(booking.endTime).toLocaleString("en-GB", { timeStyle: "short" })
      : "";

    const notes = booking?.responses?.notes?.value || booking?.description || "";
    const message = [
      `📅 Meeting booked: ${eventTitle}`,
      `Date: ${startTime}${endTime ? ` – ${endTime}` : ""}`,
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Insert into inquiries using service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("inquiries").insert({
      name,
      email,
      phone,
      message,
      type: "cal_booking",
      source_page: "/book-a-call",
    });

    if (error) {
      console.error("Failed to insert inquiry:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Booking inquiry created for ${email}`);

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
