import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) throw new Error("Unauthorized: admin role required");

    const { icp_id, icp_name, research_data } = await req.json();
    if (!icp_id || !icp_name || !research_data) {
      throw new Error("icp_id, icp_name, and research_data are required");
    }

    const prompt = `You are a world-class conversion copywriter for Earworm — a B2B branded podcast and video content production agency. You've been given detailed research about the "${icp_name}" ICP (Ideal Customer Profile).

Based on this research, generate structured landing page copy that will convert this specific audience. The copy should demonstrate deep understanding of their challenges and position Earworm as the expert solution.

RESEARCH DATA:
${typeof research_data === 'string' ? research_data : JSON.stringify(research_data)}

Generate the following JSON structure with copy for each landing page section:

{
  "hero": {
    "badge": "Short tag like 'Podcast Partner for [ICP]' (max 4 words)",
    "headline": "A bold, benefit-driven headline (max 12 words). Use line breaks strategically. Make the key benefit word/phrase stand out.",
    "highlight_word": "The one word or phrase from the headline to highlight in brand green",
    "subheadline": "2-3 sentences expanding on the headline. Specific to this ICP's world.",
    "cta_primary": "Primary CTA text (action-oriented, max 5 words)",
    "cta_secondary": "Secondary CTA text (max 5 words)"
  },
  "pain_points": {
    "section_title": "A punchy section title about their challenges",
    "section_subtitle": "One line setting up the pain points",
    "items": [
      {
        "title": "Pain point title (max 5 words)",
        "description": "2 sentences describing this challenge specifically for this ICP",
        "icon": "One of: megaphone, target, trending-down, clock, eye-off, users"
      }
    ]
  },
  "solution": {
    "section_title": "How Earworm solves this",
    "section_subtitle": "Brief intro to the solution",
    "bento_cards": [
      {
        "title": "Benefit title (max 6 words)",
        "description": "2-3 sentences on how this specifically helps this ICP",
        "tag": "Short pill tag (1-2 words)",
        "size": "large or small (first card should be large)"
      }
    ]
  },
  "stats": {
    "items": [
      {
        "value": "A compelling stat or metric (e.g. '47%', '3x', '12+')",
        "label": "What the stat represents",
        "context": "Brief context for credibility"
      }
    ]
  },
  "objection_handling": {
    "section_title": "Section title addressing hesitations",
    "items": [
      {
        "objection": "Common objection this ICP has",
        "response": "2-3 sentence reframe that addresses it"
      }
    ]
  },
  "cta_section": {
    "headline": "Final persuasive headline (max 10 words)",
    "subheadline": "1-2 sentences creating urgency or FOMO specific to this ICP",
    "cta_text": "CTA button text"
  }
}

RULES:
- Be specific to "${icp_name}" — no generic marketing speak
- Reference real challenges from the research
- Use data points and specifics where possible
- Tone: confident, expert, conversational — not salesy
- The copy should feel like it was written by someone who deeply understands this industry
- Generate exactly 4 pain points, 4 bento cards, 3 stats, and 3 objections
- Return ONLY valid JSON, no markdown wrapping`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert conversion copywriter. Return only valid JSON. No markdown code fences. No explanation.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again in a moment" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted — please top up in workspace settings" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content returned from AI");

    // Strip markdown code fences if present
    content = content.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "").trim();

    let generatedCopy;
    try {
      generatedCopy = JSON.parse(content);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", content);
      throw new Error("AI returned invalid JSON");
    }

    // Store generated copy
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: updateError } = await adminSupabase
      .from("icp_landing_pages")
      .update({
        generated_copy: generatedCopy,
        status: "generated",
        updated_at: new Date().toISOString(),
      })
      .eq("id", icp_id);

    if (updateError) {
      console.error("DB update error:", updateError);
      throw new Error("Failed to save generated copy");
    }

    return new Response(
      JSON.stringify({ success: true, generated_copy: generatedCopy }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (e) {
    console.error("generate-icp-copy error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
