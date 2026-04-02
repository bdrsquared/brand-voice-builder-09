import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Scrape a URL via Firecrawl and return its markdown + summary.
 * Returns null on failure (non-blocking).
 */
async function scrapeUrl(
  url: string,
  firecrawlKey: string
): Promise<{ url: string; title: string; markdown: string; summary: string } | null> {
  try {
    const resp = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "summary"],
        onlyMainContent: true,
      }),
    });

    if (!resp.ok) {
      console.warn(`Firecrawl scrape failed for ${url}: ${resp.status}`);
      return null;
    }

    const data = await resp.json();
    const inner = data.data || data;
    return {
      url,
      title: inner.metadata?.title || url,
      markdown: (inner.markdown || "").slice(0, 3000), // cap per-source
      summary: inner.summary || "",
    };
  } catch (err) {
    console.warn(`Firecrawl error for ${url}:`, err);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) throw new Error("PERPLEXITY_API_KEY is not configured");

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    // Firecrawl is optional — deep research degrades gracefully
    if (!FIRECRAWL_API_KEY) {
      console.warn("FIRECRAWL_API_KEY not set — skipping deep scraping");
    }

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

    // ─── Step 1: Perplexity research ───
    console.log(`Step 1: Perplexity research for "${icp_name}"`);

    const prompt = `What are the main content marketing challenges faced by "${icp_name}" and how can they beat their competition?

${contextLine ? contextLine + "\n\n" : ""}Provide a detailed, structured analysis covering:

1. **Industry Overview**: Brief landscape of this ICP's industry and current market dynamics
2. **Top Content Marketing Challenges**: The 5 biggest content marketing challenges "${icp_name}" face right now — be specific, reference real trends and data points
3. **Content & Attention Gap**: How "${icp_name}" struggle to cut through noise, build authority, and differentiate from competitors
4. **Competitive Content Landscape**: What are their competitors doing with content marketing? Where are the gaps and opportunities?
5. **Why Branded Video Podcasts Beat the Competition**: Specific, evidence-based reasons why a branded video podcast strategy gives "${icp_name}" a competitive edge over traditional content approaches
6. **Key Metrics That Matter**: What content marketing KPIs and business outcomes "${icp_name}" care about most
7. **Common Objections**: Typical objections "${icp_name}" have to investing in podcast/video content — and how to reframe them
8. **Winning Talking Points**: 5 compelling, data-backed talking points that would resonate with "${icp_name}" decision-makers

Be specific and data-driven. Cite real statistics, studies, and current trends. Focus on 2024-2026 relevance.`;

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
    const citations: string[] = perplexityData.citations || [];

    if (!researchContent) throw new Error("No research content returned from Perplexity");

    console.log(`Perplexity returned ${citations.length} citations`);

    // ─── Step 2: Deep scrape relevant citations via Firecrawl ───
    let scrapedSources: Array<{ url: string; title: string; markdown: string; summary: string }> = [];

    if (FIRECRAWL_API_KEY && citations.length > 0) {
      console.log("Step 2: Scraping relevant citations with Firecrawl");

      // Build keyword tokens from the ICP name for relevance matching
      const icpTokens = icp_name
        .toLowerCase()
        .split(/[\s,\-&]+/)
        .filter((t: string) => t.length > 2);

      // Filter citations: pick those whose URL or domain contains ICP-related terms
      // Also include top citations regardless (they were deemed most relevant by Perplexity)
      const relevantCitations: string[] = [];
      const otherCitations: string[] = [];

      for (const url of citations) {
        const urlLower = url.toLowerCase();
        const isRelevant = icpTokens.some((token: string) => urlLower.includes(token));
        if (isRelevant) {
          relevantCitations.push(url);
        } else {
          otherCitations.push(url);
        }
      }

      // Take all ICP-relevant URLs + top 3 other citations, max 8 total
      const urlsToScrape = [
        ...relevantCitations,
        ...otherCitations.slice(0, Math.max(0, 8 - relevantCitations.length)),
      ].slice(0, 8);

      console.log(`Scraping ${urlsToScrape.length} URLs (${relevantCitations.length} ICP-relevant)`);

      // Scrape in parallel
      const scrapeResults = await Promise.allSettled(
        urlsToScrape.map((url) => scrapeUrl(url, FIRECRAWL_API_KEY))
      );

      scrapedSources = scrapeResults
        .filter(
          (r): r is PromiseFulfilledResult<NonNullable<Awaited<ReturnType<typeof scrapeUrl>>>> =>
            r.status === "fulfilled" && r.value !== null
        )
        .map((r) => r.value);

      console.log(`Successfully scraped ${scrapedSources.length} sources`);
    }

    // ─── Step 3: Compile comprehensive research document ───
    const researchDocument = {
      icp_name,
      researched_at: new Date().toISOString(),
      perplexity_analysis: researchContent,
      citations,
      deep_sources: scrapedSources.map((s) => ({
        url: s.url,
        title: s.title,
        summary: s.summary,
        key_content: s.markdown,
      })),
      sources_scraped: scrapedSources.length,
      total_citations: citations.length,
    };

    // ─── Step 4: Store research data ───
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: updateError } = await adminSupabase
      .from("icp_landing_pages")
      .update({
        research_data: researchDocument,
        status: "researched",
        updated_at: new Date().toISOString(),
      })
      .eq("id", icp_id);

    if (updateError) {
      console.error("DB update error:", updateError);
      throw new Error("Failed to save research data");
    }

    return new Response(
      JSON.stringify({
        success: true,
        research: researchContent,
        citations,
        sources_scraped: scrapedSources.length,
      }),
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
