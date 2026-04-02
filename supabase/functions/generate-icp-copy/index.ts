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
    "badge": "2-3 word category label",
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
  return `You are writing a high-converting landing page for Earworm - a B2B branded podcast and video content production agency. This page targets "${icp_name}".

## TONE: Casual professional. Data-led. Authoritative. Clever.
- Sound like the smartest person in the room who also happens to be approachable
- Lead with data, stats and specifics - not feelings
- Use British English spelling
- NEVER use em dashes (—) - use spaced hyphers ( - ) instead
- NEVER use Oxford commas
- Be direct and confident. Not arrogant, but clearly expert
- Use "you" and "your" throughout - speak directly to ${icp_name} decision-makers
- Reference specific industry realities, not generic marketing speak
- Short paragraphs. Punchy sentences. Let the data do the heavy lifting
- NEVER use corporate jargon: leverage, ecosystem, robust, game-changer, synergy, disruptive, cutting-edge
- NEVER use AI-isms: In conclusion, Let's dive in, In today's landscape

## RESEARCH DATA:
${researchText}

## GENERATE THIS JSON STRUCTURE:

{
  "style": "authority",
  "hero": {
    "badge": "For ${icp_name}",
    "headline": "Video podcasting for [role/team type] that want to [specific outcome]. Max 12 words. Bold, specific. IMPORTANT: The headline must NOT start with 'For' - just name the ICP directly.",
    "highlight_phrase": "The outcome phrase to highlight in green italic",
    "subheadline": "Built for [industry reality], not generic content strategies. One sentence that makes them think 'this is for me'.",
    "cta_primary": "Request a conversation",
    "cta_secondary": "See how it works"
  },
  "problem": {
    "label": "● Sound familiar?",
    "headline": "A headline that captures their frustration. Max 12 words.",
    "headline_grey_part": "The trailing grey phrase",
    "cards": [
      {
        "title": "What you're doing",
        "description": "2-3 sentences about their current content approach. Be specific to ${icp_name}."
      },
      {
        "title": "What's not working",
        "description": "2-3 sentences about why it's failing. Use data from the research."
      },
      {
        "title": "The internal challenge",
        "description": "2-3 sentences about budget, buy-in, consistency struggles."
      },
      {
        "title": "The market reality",
        "description": "2-3 sentences about competitive pressure and changing buyer behaviour."
      }
    ]
  },
  "shift": {
    "label": "● The shift",
    "headline": "A reframing headline. Position podcasting as a system, not a channel.",
    "headline_green_phrase": "Key phrase to render in green gradient",
    "description": "2-3 sentences. Reframe how they should think about content. Bold, opinionated."
  },
  "opportunity": {
    "label": "● Why now",
    "headline": "A headline about why the timing is right for ${icp_name}",
    "items": [
      {
        "stat": "A compelling data point (e.g. '73%', '3.2x')",
        "title": "Short title (4-6 words)",
        "description": "1-2 sentences. Why this matters for ${icp_name} specifically.",
        "source": "Source attribution"
      }
    ]
  },
  "model": {
    "label": "● How it works",
    "headline": "Record once. Distribute everywhere.",
    "headline_secondary": "A supporting line about the system",
    "steps": [
      {
        "number": "01",
        "title": "Strategy",
        "description": "2-3 sentences. What happens in this phase. Specific to ${icp_name}.",
        "details": ["Detail 1", "Detail 2", "Detail 3"]
      },
      {
        "number": "02",
        "title": "Production",
        "description": "2-3 sentences.",
        "details": ["Detail 1", "Detail 2", "Detail 3"]
      },
      {
        "number": "03",
        "title": "Distribution",
        "description": "2-3 sentences.",
        "details": ["Detail 1", "Detail 2", "Detail 3"]
      }
    ]
  },
  "proof": {
    "label": "● It works",
    "headline": "A headline about results",
    "metrics": [
      { "value": "A metric (e.g. '400%')", "label": "What it measures", "context": "Brief context" }
    ],
    "testimonial": {
      "quote": "A short, punchy testimonial quote (make it realistic and specific to content/podcasting results)",
      "author": "Name",
      "role": "Title, Company"
    }
  },
  "tangible": {
    "label": "● What this looks like for you",
    "headline": "Working with Earworm",
    "items": [
      {
        "title": "Short title (3-5 words)",
        "description": "1-2 sentences about the experience or deliverable"
      }
    ]
  },
  "why_earworm": {
    "label": "● Why Earworm",
    "headline": "A differentiation headline. Subtle premium positioning.",
    "points": [
      {
        "title": "One word or short phrase (e.g. 'Quality', 'Strategy-first')",
        "description": "1-2 sentences. What makes Earworm different here."
      }
    ]
  },
  "qualification": {
    "headline": "We work with a small number of teams at any one time.",
    "description": "1-2 sentences. Soft qualification. Make selectivity feel valuable, not exclusive."
  },
  "cta_section": {
    "headline": "A final headline. Specific outcome for ${icp_name}.",
    "headline_green_phrase": "The green gradient phrase",
    "subheadline": "Request a conversation. If it's a fit, we'll take it from there.",
    "cta_text": "Request a conversation"
  }
}

## CONTENT RULES:
- Generate exactly 4 problem cards, 4 opportunity items, 3 model steps, 3 proof metrics, 4 tangible items, 4 why_earworm points
- Each model step needs exactly 3 details
- Stats and metrics should reference real data from the research where possible
- The testimonial should feel realistic (for a podcast production agency)
- The whole page should feel like it was written by someone who deeply understands ${icp_name}
- Use a small amount of ICP-specific jargon naturally
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
