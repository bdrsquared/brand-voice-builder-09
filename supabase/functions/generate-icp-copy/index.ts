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

    const researchText = typeof research_data === "string" ? research_data : JSON.stringify(research_data);

    const prompt = `You are writing landing page copy for Earworm - a B2B branded podcast and video content production agency. You're writing specifically for "${icp_name}".

## BRAND VOICE RULES (CRITICAL - follow these exactly):
- Write like a smart person who reads a lot, not a marketing team
- Use direct "you" addresses throughout
- Use British English spelling
- NEVER use em dashes (—) - use spaced hyphens ( - ) instead
- NEVER use Oxford commas
- NEVER use corporate jargon like: leverage, ecosystem, robust, game-changer, holistic, synergy, disruptive, cutting-edge, best-in-class, turnkey
- NEVER use AI-isms like: In conclusion, Let's dive in, In today's landscape, It's worth noting
- Start some sentences with And, But, Or - like a real person talks
- Use occasional filler words naturally (like, kind of, actually)
- Be direct, opinionated and specific. Not hedging, not vague
- End sections abruptly - no neat wrap-ups or polished conclusions
- Reference specific problems this ICP actually has. Use a small amount of their industry jargon naturally - enough to show you know their world, not so much it feels forced

## RESEARCH DATA:
${researchText}

## GENERATE THIS JSON STRUCTURE:

{
  "hero": {
    "badge": "2-3 word category label (e.g. 'For SaaS teams' or 'Fintech content')",
    "headline": "Bold headline, max 10 words. Should feel like a truth bomb, not a tagline. Make one phrase the hero.",
    "highlight_phrase": "The exact phrase from the headline to highlight in brand green (italic)",
    "subheadline": "2 sentences. Speak directly to this ICP's reality. Reference a specific challenge from the research. No fluff.",
    "cta_primary": "Start a conversation",
    "cta_secondary": "See how it works"
  },
  "problem": {
    "label": "● The problem",
    "headline": "A headline that names their specific content problem. End with a short grey-coloured phrase that reframes it. Max 15 words total.",
    "headline_grey_part": "The last few words that should render in grey/secondary colour",
    "paragraphs": [
      "First paragraph - describe the specific content challenge this ICP faces. Be concrete. Reference things from their world.",
      "Second paragraph - contrast with what winning companies in their space are doing differently. End abruptly."
    ]
  },
  "value_props": {
    "label": "● Why podcasting works for ${icp_name}",
    "headline": "A headline about the specific value. Use text-gradient-green on one key phrase.",
    "headline_green_phrase": "The phrase to render in green gradient",
    "items": [
      {
        "title": "Short benefit title (4-6 words)",
        "description": "2-3 sentences explaining this benefit specifically for ${icp_name}. Use their language. Be specific about outcomes.",
        "icon_color": "green or blue (alternate)"
      }
    ]
  },
  "bento": {
    "label": "● What this looks like in practice",
    "headline": "A system-focused headline",
    "headline_secondary": "A secondary grey line",
    "cards": [
      {
        "title": "Card title (3-6 words)",
        "description": "2 sentences. Specific to this ICP.",
        "pills": ["Pill 1", "Pill 2"],
        "size": "large for first card, small for rest",
        "variant": "dark for first card, light for rest"
      }
    ]
  },
  "stats": {
    "headline": "A headline about why ${icp_name} are investing in podcast content",
    "headline_aside": "A short supporting line",
    "items": [
      {
        "title": "Short context title",
        "value": "A real stat (e.g. '74%', '3x', '10-20x')",
        "label": "What the stat means for this ICP specifically",
        "source": "Source attribution"
      }
    ]
  },
  "objections": {
    "label": "● But what about...",
    "headline": "A headline that acknowledges their hesitations honestly",
    "items": [
      {
        "objection": "A real objection this ICP would have (in their words)",
        "response": "2-3 sentences. Reframe it honestly. Don't be dismissive. Show you get why they'd think this."
      }
    ]
  },
  "cta_section": {
    "headline": "Final headline - specific to this ICP. Reference a concrete outcome.",
    "headline_green_phrase": "The phrase to render in green gradient",
    "subheadline": "1-2 sentences. Direct. Personal. Not salesy.",
    "cta_text": "Start a conversation"
  }
}

## CONTENT RULES:
- Generate exactly 4 value props, 5 bento cards (1 large + 4 small), 3 stats, and 3 objections
- Stats should reference real data from the research where possible
- Each bento card needs 2-3 pills
- Pain points must be specific to "${icp_name}" - not generic content marketing problems
- The whole page should feel like it was written by someone who's spent years in this ICP's industry
- Use a small amount of ICP-specific jargon naturally
- Return ONLY valid JSON. No markdown wrapping. No explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: "You are an expert conversion copywriter writing in the Earworm brand voice. You write like a smart, opinionated person - not a marketing team. Use British English. Never use em dashes. Return only valid JSON with no markdown fences.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited - please try again in a moment" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted - please top up in workspace settings" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content returned from AI");

    content = content.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "").trim();

    let generatedCopy;
    try {
      generatedCopy = JSON.parse(content);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", content.slice(0, 500));
      throw new Error("AI returned invalid JSON");
    }

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
