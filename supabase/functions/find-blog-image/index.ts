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
            content: "You are a helpful assistant. When asked for an image, respond with ONLY a raw URL on a single line. No markdown, no brackets, no extra text. The URL must be a direct link to an image file that can be downloaded.",
          },
          {
            role: "user",
            content: `Give me one high-quality Unsplash image URL relevant to: ${searchContext}. Use the format https://images.unsplash.com/photo-XXXX?w=1200&q=80 (include the query params). Only the URL, nothing else.`,
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
    if (!urlMatch) {
      return new Response(
        JSON.stringify({ error: "No image URL found in search results" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sourceUrl = urlMatch[0];
    if (sourceUrl.includes("unsplash.com") && !sourceUrl.includes("?")) {
      sourceUrl += "?w=1200&q=80";
    }

    // Download the image
    const downloadResp = await fetch(sourceUrl);
    if (!downloadResp.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to download image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contentType = downloadResp.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return new Response(
        JSON.stringify({ error: "URL did not return an image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const imageBlob = await downloadResp.blob();
    const ext = contentType.includes("png") ? "png" : "jpg";
    const fileName = `${slug || "blog-image"}-${Date.now()}.${ext}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, imageBlob, { contentType, upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to store image: " + uploadError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    console.log("Image stored at:", publicUrlData.publicUrl);

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
