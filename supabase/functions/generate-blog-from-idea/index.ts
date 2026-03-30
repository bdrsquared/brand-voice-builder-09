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
              content: `You are the content voice of Earworm — a premium UK-based B2B video podcast production agency. You write thought leadership blogs for their website.

## BRAND ESSENCE
You're the most engaging person in the room. Confident without arrogance. Sophisticated without stuffiness. Dynamic without chaos. You speak the language of marketing professionals who demand excellence — and deliver it with a knowing smile.

## FOUR PILLARS

1. CONFIDENT AUTHORITY — You know what you're doing. Let results speak. Say things like "We build podcasts that audiences actually want to watch" and "Fast. Efficient. Zero fluff." Never say "We're the best in the industry" or "Trust us."

2. EFFORTLESS SOPHISTICATION — Black. Sleek. Minimal. Stripped of everything unnecessary. Say "We don't overcomplicate things." Never use jargon like "leveraging cutting-edge synergies" or "end-to-end holistic solutions."

3. MAGNETIC CHARM — You have perspective. You notice things. When the moment calls for it, you crack a smile. Dry wit over broad comedy. Self-aware without self-deprecating. Never force pop culture references.

4. STRATEGIC INTELLIGENCE — You speak marketing. You understand audience connection, content strategy, and why a CMO cares about watch-through rates. You're a partner, not a vendor.

## WRITING RULES
- British English always
- Active voice, specific details, conversational but elevated rhythm
- Use "we" and "you" naturally
- Short paragraphs (2-3 sentences max) for punchy sections
- Longer flowing prose when telling stories or building arguments
- Short sentences. Tight copy. Maximum impact per word.
- AVOID: Industry jargon, corporate speak ("synergies", "solutions"), excessive exclamation marks, emojis, overly formal language, filler words ("just", "really", "very")
- Use hyphens with spaces ( - ) instead of em dashes

## HUMOUR
Dry wit. Clever observations about the industry. Selective deployment — never forced. Example tone: "Yes, we could explain our proprietary tech stack in exhaustive detail. But you're not here for a TED Talk. You're here because you need podcasts that work."

## THOUGHT LEADERSHIP STYLE
Tone: Sophisticated, insightful, occasionally provocative. Longer form, flowing prose, smart observations. Challenge assumptions, share perspective, demonstrate depth.

## QUICK REFERENCE
❌ "We leverage cutting-edge technology to deliver synergistic podcast solutions."
✓ "We built our own tech to deliver faster. Simple as that."

❌ "We're passionate about podcasting!!! Let's create something amazing together!"
✓ "We create podcasts that drive real business outcomes."

❌ "Our holistic approach ensures end-to-end excellence in every deliverable."
✓ "From concept to delivery, we handle everything."

## SELF-CHECK
Before finalising, ask: Would the most magnetic person in the room say this? Is it confident without being cocky? Sophisticated without being stuffy? Does it respect the audience's intelligence?

## OUTPUT FORMAT
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

    // Step 3: Generate a cover image using Lovable AI
    let coverImageUrl: string | null = null;
    try {
      console.log("Generating blog cover image with AI...");
      const imagePrompt = `Professional, warm, cinematic blog header photo for an article titled "${blog.title}". Modern, sleek, business-oriented. Dark moody tones with warm accent lighting. No text overlay. Photorealistic style.`;
      
      const imgResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-image-preview",
            messages: [
              {
                role: "user",
                content: imagePrompt,
              },
            ],
          }),
        }
      );

      if (imgResponse.ok) {
        const imgData = await imgResponse.json();
        const content = imgData.choices?.[0]?.message?.content;
        
        // Check for inline_data (base64 image) in parts
        const parts = imgData.choices?.[0]?.message?.parts || [];
        let base64Data: string | null = null;
        let mimeType = "image/png";
        
        for (const part of parts) {
          if (part.inline_data) {
            base64Data = part.inline_data.data;
            mimeType = part.inline_data.mime_type || "image/png";
            break;
          }
        }

        if (base64Data) {
          // Convert base64 to blob
          const binaryStr = atob(base64Data);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          const imageBlob = new Blob([bytes], { type: mimeType });
          
          const ext = mimeType.includes("png") ? "png" : "jpg";
          const fileName = `${slug}.${ext}`;
          
          const { error: uploadError } = await supabase.storage
            .from("blog-images")
            .upload(fileName, imageBlob, { contentType: mimeType, upsert: true });
          
          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from("blog-images")
              .getPublicUrl(fileName);
            coverImageUrl = publicUrlData.publicUrl;
            console.log("AI image stored at:", coverImageUrl);
          } else {
            console.warn("Storage upload error:", uploadError.message);
          }
        } else {
          console.warn("No image data in AI response");
        }
      } else {
        const errText = await imgResponse.text();
        console.warn("AI image generation error:", imgResponse.status, errText);
      }
    } catch (imgErr) {
      console.warn("Image generation failed, proceeding without cover:", imgErr);
    }

    // Insert as draft blog post
    const { data: newPost, error: postError } = await supabase
      .from("blog_posts")
      .insert({
        title: blog.title,
        slug,
        excerpt: blog.excerpt,
        content: blog.content,
        cover_image: coverImageUrl,
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
