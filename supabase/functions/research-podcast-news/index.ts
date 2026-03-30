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
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) {
      return new Response(
        JSON.stringify({ error: "PERPLEXITY_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch existing idea titles to avoid duplicates (including declined ones)
    const { data: existingIdeas } = await supabase
      .from("blog_ideas")
      .select("title");
    const existingTitles = (existingIdeas || []).map((i: { title: string }) => i.title);

    // Also fetch existing blog post titles
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("title");
    const existingPostTitles = (existingPosts || []).map((p: { title: string }) => p.title);

    const allExistingTitles = [...existingTitles, ...existingPostTitles];
    const exclusionList = allExistingTitles.length > 0
      ? `\n\nDo NOT suggest ideas similar to these existing titles:\n${allExistingTitles.map(t => `- ${t}`).join("\n")}`
      : "";

    // Randomise the angle to get different results each time
    const angles = [
      "branded podcast launches, partnerships, and sponsor deals",
      "podcast technology, AI tools, hosting platforms, and distribution changes",
      "video podcasting trends, YouTube podcast growth, and visual formats",
      "B2B podcasting strategies, thought leadership, and corporate content",
      "podcast audience growth, marketing tactics, and discoverability",
      "podcast monetisation models, ad revenue shifts, and creator economy",
      "podcast production innovations, remote recording, and workflow tools",
      "podcast industry mergers, acquisitions, and business moves",
      "independent podcaster success stories and breakout shows",
      "podcast content formats, storytelling trends, and narrative innovation",
      "podcast analytics, measurement, and ROI tracking developments",
      "live podcasting, events, and community-driven audio",
    ];
    // Pick 3 random angles to combine
    const shuffled = angles.sort(() => Math.random() - 0.5);
    const chosenAngles = shuffled.slice(0, 3).join("; ");
    const randomSeed = Math.random().toString(36).slice(2, 8);
    const today = new Date().toISOString().split("T")[0];

    const searchResponse = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "You are a podcast industry analyst who finds fresh, surprising stories. Return exactly 5 recent podcast industry news stories or trends. For each, provide a title and a 2-3 sentence summary. Return as JSON array with objects containing 'title', 'summary', and 'source_url' fields. Only return the JSON array, no other text.",
          },
          {
            role: "user",
            content:
              `Date: ${today} | Session: ${randomSeed}\n\nFind 5 fresh and surprising podcast industry stories from the past week. Focus specifically on: ${chosenAngles}.\n\nDig beyond the obvious headlines — find niche, unexpected, or under-reported stories that a podcast agency would find valuable.${exclusionList}`,
          },
        ],
        search_recency_filter: "week",
      }),
    });

    if (!searchResponse.ok) {
      const errText = await searchResponse.text();
      console.error("Perplexity API error:", searchResponse.status, errText);

      if (searchResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (searchResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Perplexity credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to search for podcast news" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchData = await searchResponse.json();
    const content = searchData.choices?.[0]?.message?.content || "";
    const citations = searchData.citations || [];

    // Parse the JSON from the response
    let ideas: Array<{ title: string; summary: string; source_url?: string }> = [];
    try {
      // Try to extract JSON from the response (may have markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Failed to parse ideas JSON:", e, "Content:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse research results" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert ideas into blog_ideas table
    const inserts = ideas.slice(0, 5).map((idea, i) => ({
      title: idea.title,
      description: idea.summary,
      source: "Perplexity Research",
      source_url: idea.source_url || citations[i] || null,
      status: "new",
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("blog_ideas")
      .insert(inserts)
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save ideas: " + insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Notify Slack with interactive buttons
    try {
      const notifyUrl = `${supabaseUrl}/functions/v1/slack-notify-ideas`;
      await fetch(notifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ ideas: inserted }),
      });
    } catch (slackErr) {
      console.warn("Slack notification failed (non-blocking):", slackErr);
    }

    return new Response(
      JSON.stringify({ success: true, ideas: inserted, count: inserted?.length || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("research-podcast-news error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
