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

    // Search for latest podcast industry news
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
              "You are a podcast industry analyst. Return exactly 5 recent podcast industry news stories or trends. For each, provide a title and a 2-3 sentence summary. Focus on B2B podcasting, branded podcasts, video podcasting, podcast marketing, and podcast production trends. Return as JSON array with objects containing 'title', 'summary', and 'source_url' fields. Only return the JSON array, no other text.",
          },
          {
            role: "user",
            content:
              "What are the top 5 most interesting podcast industry news stories or trends from the past week? Include stories about branded podcasts, B2B podcasting, video podcasting, podcast marketing strategies, and podcast production innovations.",
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
