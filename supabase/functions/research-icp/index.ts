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
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) throw new Error("PERPLEXITY_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    // Verify admin role
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

    const { icp_id, icp_name, icp_description } = await req.json();
    if (!icp_id || !icp_name) throw new Error("icp_id and icp_name are required");

    const contextLine = icp_description
      ? `Additional context: ${icp_description}`
      : "";

    const prompt = `You are a senior marketing strategist specialising in branded podcast and audio content for B2B companies. Research and analyse the unique marketing challenges faced by "${icp_name}" (${contextLine}).

Provide a structured analysis covering:

1. **Industry Overview**: Brief landscape of this ICP's industry and market dynamics
2. **Top Marketing Challenges**: The 5 biggest marketing challenges this ICP faces right now (be specific and current)
3. **Content & Attention Gap**: How this ICP struggles to cut through noise and build authority
4. **Why Branded Podcasts Solve This**: Specific reasons why a branded podcast strategy would address their challenges
5. **Competitor Landscape**: What competitors in this space are doing with content (and where the gaps are)
6. **Key Metrics That Matter**: What KPIs and outcomes this ICP cares about most
7. **Objections & Barriers**: Common objections this ICP might have to investing in podcast content
8. **Talking Points**: 3-5 compelling talking points that would resonate with this ICP

Be specific, data-driven where possible, and cite real trends or statistics. Focus on 2024-2025 relevance.`;

    const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: "You are an expert marketing research analyst. Provide detailed, actionable insights grounded in real data and current market trends. Always be specific — avoid generic advice.",
          },
          { role: "user", content: prompt },
        ],
        search_recency_filter: "year",
      }),
    });

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text();
      console.error("Perplexity API error:", perplexityResponse.status, errorText);
      throw new Error(`Perplexity API error: ${perplexityResponse.status}`);
    }

    const perplexityData = await perplexityResponse.json();
    const researchContent = perplexityData.choices?.[0]?.message?.content;
    const citations = perplexityData.citations || [];

    if (!researchContent) throw new Error("No research content returned from Perplexity");

    // Store research data using service role
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: updateError } = await adminSupabase
      .from("icp_landing_pages")
      .update({
        research_data: {
          content: researchContent,
          citations,
          researched_at: new Date().toISOString(),
        },
        status: "researched",
        updated_at: new Date().toISOString(),
      })
      .eq("id", icp_id);

    if (updateError) {
      console.error("DB update error:", updateError);
      throw new Error("Failed to save research data");
    }

    return new Response(
      JSON.stringify({ success: true, research: researchContent, citations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (e) {
    console.error("research-icp error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
