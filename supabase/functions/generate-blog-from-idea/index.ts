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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { idea_id } = await req.json();
    if (!idea_id) {
      return new Response(
        JSON.stringify({ error: "idea_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the idea
    const { data: idea, error: ideaError } = await supabase
      .from("blog_ideas")
      .select("*")
      .eq("id", idea_id)
      .single();

    if (ideaError || !idea) {
      return new Response(
        JSON.stringify({ error: "Idea not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update idea status to generating
    await supabase
      .from("blog_ideas")
      .update({ status: "generating" })
      .eq("id", idea_id);

    // Generate blog post using Lovable AI
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a content writer for Earworm Podcast Agency — a UK-based B2B video podcast production company. 

Your tone of voice is:
- Professional but approachable — not corporate jargon
- Confident and knowledgeable — you're the expert in the room
- Warm and conversational — like chatting with a smart colleague
- Action-oriented — give practical, usable advice
- Subtly witty — not try-hard funny, but engaging

Write in British English. Use short paragraphs (2-3 sentences max). Break up content with clear subheadings. 

Return your response as JSON with these fields:
- "title": a compelling blog title (max 80 chars)
- "excerpt": a summary for cards/previews (max 160 chars)
- "content": the full blog post in HTML using <p>, <h2>, <h3>, <strong>, <em>, <ul>, <li> tags. Add <br/> between paragraphs for spacing. Aim for 800-1200 words.
- "category": one of "Strategy", "Production", "Marketing", "Business", "Industry News"

Only return the JSON object, nothing else.`,
            },
            {
              role: "user",
              content: `Write a blog post based on this idea:

Title: ${idea.title}
Description: ${idea.description || "No additional context provided."}
${idea.source_url ? `Source: ${idea.source_url}` : ""}

Make it insightful, practical, and relevant to B2B marketers and business leaders considering podcasting as a growth channel.`,
            },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);

      await supabase
        .from("blog_ideas")
        .update({ status: "error" })
        .eq("id", idea_id);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate blog" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";

    // Parse the JSON blog
    let blog: { title: string; excerpt: string; content: string; category: string };
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        blog = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (e) {
      console.error("Failed to parse blog JSON:", e);
      await supabase
        .from("blog_ideas")
        .update({ status: "error" })
        .eq("id", idea_id);
      return new Response(
        JSON.stringify({ error: "Failed to parse generated blog" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate slug
    const slug = blog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Insert as draft blog post
    const { data: newPost, error: postError } = await supabase
      .from("blog_posts")
      .insert({
        title: blog.title,
        slug,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category,
        author: "Earworm",
        published: false,
      })
      .select()
      .single();

    if (postError) {
      console.error("Post insert error:", postError);
      await supabase
        .from("blog_ideas")
        .update({ status: "error" })
        .eq("id", idea_id);
      return new Response(
        JSON.stringify({ error: "Failed to save blog post: " + postError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update idea status to approved
    await supabase
      .from("blog_ideas")
      .update({ status: "approved" })
      .eq("id", idea_id);

    return new Response(
      JSON.stringify({ success: true, post: newPost }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-blog-from-idea error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
