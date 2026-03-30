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

    const { title, excerpt, slug } = await req.json();
    if (!title) {
      return new Response(
        JSON.stringify({ error: "title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Ask Perplexity for a relevant Unsplash image
    const searchContext = excerpt ? `${title}. ${excerpt}` : title;

    // Ask Perplexity to suggest search keywords for finding a relevant image
    const imgResponse = await fetch("https://api.perplexity.ai/chat/completions", {
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
            content: "You find free stock photos. When given a blog topic, search for a relevant photo on Unsplash or Pexels and return ONLY the direct image file URL. The URL must end in a common image extension or contain /download. No markdown, no text, just one URL.",
          },
          {
            role: "user",
            content: `Find a free, high-quality photo relevant to this blog: "${searchContext}". Return only the direct image URL.`,
          },
        ],
      }),
    });

    if (!imgResponse.ok) {
      console.error("Perplexity error:", imgResponse.status);
      return new Response(
        JSON.stringify({ error: "Image search failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const imgData = await imgResponse.json();
    const imgContent = imgData.choices?.[0]?.message?.content?.trim() || "";
    console.log("Perplexity image response:", imgContent);

    const urlMatch = imgContent.match(/https?:\/\/[^\s"'<>\)]+/i);

    let imageBlob: Blob | null = null;
    let finalContentType = "image/jpeg";

    // Try the Perplexity-suggested URL first
    if (urlMatch) {
      let sourceUrl = urlMatch[0];
      if (sourceUrl.includes("unsplash.com") && !sourceUrl.includes("?")) {
        sourceUrl += "?w=1200&q=80";
      }
      console.log("Trying Perplexity URL:", sourceUrl);

      try {
        const downloadResp = await fetch(sourceUrl, { redirect: "follow" });
        if (downloadResp.ok) {
          const ct = downloadResp.headers.get("content-type") || "";
          if (ct.startsWith("image/")) {
            imageBlob = await downloadResp.blob();
            finalContentType = ct;
            console.log("Successfully downloaded from Perplexity URL");
          }
        }
      } catch (e) {
        console.warn("Perplexity URL download failed:", e);
      }
    }

    // Fallback: use Unsplash source redirect (always works)
    if (!imageBlob) {
      const keywords = title.split(/\s+/).slice(0, 3).join(",").toLowerCase();
      const fallbackUrl = `https://source.unsplash.com/1200x800/?${encodeURIComponent(keywords)}`;
      console.log("Fallback to Unsplash source:", fallbackUrl);

      try {
        const fallbackResp = await fetch(fallbackUrl, { redirect: "follow" });
        if (fallbackResp.ok) {
          const ct = fallbackResp.headers.get("content-type") || "";
          if (ct.startsWith("image/")) {
            imageBlob = await fallbackResp.blob();
            finalContentType = ct;
            console.log("Successfully downloaded from Unsplash source fallback");
          }
        }
      } catch (e) {
        console.warn("Unsplash fallback failed:", e);
      }
    }

    if (!imageBlob) {
      return new Response(
        JSON.stringify({ error: "Could not download any image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ext = finalContentType.includes("png") ? "png" : "jpg";
    const fileName = `${slug || "blog-image"}-${Date.now()}.${ext}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, imageBlob, { contentType: finalContentType, upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to store image: " + uploadError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ cover_image: publicUrlData.publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("find-blog-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
