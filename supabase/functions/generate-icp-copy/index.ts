import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Prompt builder per style ──

function buildOriginalPrompt(icp_name: string, researchText: string) {
  return `You are writing landing page copy for Earworm - a B2B branded podcast and video content production agency. You're writing specifically for "${icp_name}".

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
- Reference specific problems this ICP actually has. Use a small amount of their industry jargon naturally

## RESEARCH DATA:
${researchText}

## GENERATE THIS JSON STRUCTURE:

{
  "hero": {
    "badge": "2-3 word category label - just the ICP name, NEVER start with 'For'",
    "headline": "Bold headline, max 10 words. Make one phrase the hero.",
    "highlight_phrase": "The exact phrase from the headline to highlight in brand green (italic)",
    "subheadline": "2 sentences. Speak directly to this ICP's reality.",
    "cta_primary": "Start a conversation",
    "cta_secondary": "See how it works"
  },
  "problem": {
    "label": "● The problem",
    "headline": "A headline that names their specific content problem. Max 15 words total.",
    "headline_grey_part": "The last few words that should render in grey",
    "paragraphs": ["First paragraph", "Second paragraph"]
  },
  "value_props": {
    "label": "● Why podcasting works for ${icp_name}",
    "headline": "A headline about the specific value",
    "headline_green_phrase": "The phrase to render in green gradient",
    "items": [
      { "title": "Short benefit title (4-6 words)", "description": "2-3 sentences for ${icp_name}", "icon_color": "green or blue" }
    ]
  },
  "bento": {
    "label": "● What this looks like in practice",
    "headline": "A system-focused headline",
    "headline_secondary": "A secondary grey line",
    "cards": [
      { "title": "Card title", "description": "2 sentences.", "pills": ["Pill 1", "Pill 2"], "size": "large for first card, small for rest", "variant": "dark for first card, light for rest" }
    ]
  },
  "stats": {
    "headline": "A headline about why ${icp_name} are investing in podcast content",
    "headline_aside": "A short supporting line",
    "items": [
      { "title": "Short context title", "value": "A real stat", "label": "What the stat means", "source": "Source" }
    ]
  },
  "objections": {
    "label": "● But what about...",
    "headline": "A headline that acknowledges hesitations",
    "items": [
      { "objection": "A real objection", "response": "2-3 sentences." }
    ]
  },
  "cta_section": {
    "headline": "Final headline specific to this ICP",
    "headline_green_phrase": "The phrase to render in green gradient",
    "subheadline": "1-2 sentences. Direct. Personal.",
    "cta_text": "Start a conversation"
  }
}

## CONTENT RULES:
- Generate exactly 4 value props, 5 bento cards (1 large + 4 small), 3 stats, and 3 objections
- Stats should reference real data from the research where possible
- Each bento card needs 2-3 pills
- Return ONLY valid JSON. No markdown wrapping.`;
}

function buildAuthorityPrompt(icp_name: string, researchText: string) {
  return `You are a head of marketing at a B2B podcast production agency called Earworm. You're writing a landing page that sells directly to "${icp_name}" decision-makers. Keep it SHORT and punchy - every word must earn its place.

## TONE:
- Confident, data-led, clever. Not salesy
- Use British English. NEVER use em dashes (—) - use spaced hyphens ( - ) instead
- NEVER use Oxford commas
- NEVER use: leverage, ecosystem, robust, game-changer, synergy, cutting-edge, In conclusion, Let's dive in
- Speak their language. Use a small amount of ${icp_name} industry jargon naturally
- Short sentences. One idea per sentence. No fluff

## RESEARCH DATA:
${researchText}

## GENERATE THIS JSON (keep copy SHORT - this is a visual page, not a blog):

{
  "style": "authority",
  "hero": {
    "badge": "${icp_name}",
    "headline": "Max 10 words. Bold. Outcome-focused. NEVER start with 'For'. Position Earworm as experts IN this field.",
    "highlight_phrase": "The 2-3 word outcome phrase to highlight in green italic",
    "subheadline": "One sentence. Max 20 words. Make them think 'this is for me'.",
    "cta_primary": "Request a conversation",
    "cta_secondary": "See how it works",
    "image_query": "A 2-3 word Unsplash search query related to ${icp_name} industry (e.g. 'cybersecurity technology', 'fintech office', 'healthcare team')"
  },
  "pain_points": {
    "label": "● Sound familiar?",
    "headline": "Max 10 words. Name their frustration.",
    "items": [
      {
        "title": "Max 6 words",
        "description": "One sentence. Max 20 words. Specific to ${icp_name}."
      }
    ]
  },
  "how_it_works": {
    "label": "● How it works",
    "headline": "Record once. Distribute everywhere.",
    "steps": [
      {
        "number": "01",
        "title": "One word (Strategy / Production / Distribution)",
        "description": "One sentence. Max 25 words. What happens in this phase.",
        "image_query": "A 2-3 word Unsplash search query for this step (e.g. 'podcast studio', 'video editing', 'social media content')"
      }
    ]
  },
  "stats": {
    "headline": "Max 10 words about why ${icp_name} are investing in podcasts",
    "items": [
      {
        "value": "A stat (e.g. '73%', '3.2x', '47%')",
        "label": "Max 8 words. What it measures.",
        "source": "Source name"
      }
    ]
  },
  "differentiators": {
    "label": "● Why Earworm",
    "headline": "Max 10 words. Subtle premium positioning.",
    "items": [
      {
        "title": "One word or two (e.g. 'Quality', 'Strategy-first')",
        "description": "One sentence. Max 20 words."
      }
    ]
  },
  "cta_section": {
    "headline": "Max 10 words. Specific outcome for ${icp_name}.",
    "headline_green_phrase": "The 2-3 word green gradient phrase",
    "subheadline": "One sentence. Direct.",
    "cta_text": "Request a conversation"
  }
}

## CONTENT RULES:
- Generate exactly 3 pain_points, 3 how_it_works steps, 3 stats, 4 differentiators
- Keep ALL descriptions to ONE sentence max
- Stats should use real data from the research where possible
- image_query values should be simple Unsplash search terms relevant to the ICP industry
- The page should feel like it was written by an insider who knows ${icp_name}
- Return ONLY valid JSON. No markdown wrapping. No explanation.`;
}

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

    const { icp_id, icp_name, research_data, page_style = "original" } = await req.json();
    if (!icp_id || !icp_name || !research_data) {
      throw new Error("icp_id, icp_name, and research_data are required");
    }

    const researchText = typeof research_data === "string" ? research_data : JSON.stringify(research_data);

    const prompt = page_style === "authority"
      ? buildAuthorityPrompt(icp_name, researchText)
      : buildOriginalPrompt(icp_name, researchText);

    const systemMessage = page_style === "authority"
      ? "You are an expert conversion copywriter. You write data-led, authoritative copy that's confident and clever without being arrogant. British English. No em dashes. Return only valid JSON."
      : "You are an expert conversion copywriter writing in the Earworm brand voice. You write like a smart, opinionated person - not a marketing team. Use British English. Never use em dashes. Return only valid JSON with no markdown fences.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemMessage },
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
        page_style,
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
