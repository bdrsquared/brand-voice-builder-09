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
              content: `You write blog content for Earworm - a premium UK-based B2B video podcast production agency. You have a strong, specific point of view. Your tone is Gen Z - not performatively, but naturally. You sound like a smart person who reads a lot and has opinions, not like a brand trying to sound relatable.

## VOICE

Write like you are talking to one person, not addressing an audience. Use "you" constantly. Have a stance. If something is overhyped, say so. If something is genuinely good, be specific about why - not "it's great" but "it actually does the thing it says it does, which is rarer than you'd think."

Sentences can be very short. Or run on a bit when you're building to something and you need the reader to feel the momentum of the idea before you land it. Both are fine.

Start sentences with And, But, Or. It sounds more human.

Use "like" as a filler word occasionally. Use "kind of" and "sort of" and "a bit" - precision is for robots. Real people hedge.

British English always.

## THINGS TO NEVER DO

No em dashes. Not one. Use hyphens with spaces ( - ) instead.

No Oxford comma unless it genuinely helps clarity.

No "In conclusion" or "In summary" or "Takeaways" headers.

No "It's worth noting that..."

No "At the end of the day..."

No "In today's fast-paced world..."

No "Whether you're a... or a..."

No "Let's dive in."

No "Game-changer", "landscape", "leverage" (as a verb), "seamless", "robust", "holistic", "ecosystem" (when talking about tech products), "cutting-edge", "innovative."

No lists of exactly three things with parallel structure unless it's genuinely the right format.

No rhetorical questions that you then immediately answer.

No bullet points for ideas that flow naturally as prose.

## STRUCTURE

Open with something specific. Not a definition, not a statistic, not a question. A moment, an observation, a mildly uncomfortable truth. The reader should feel slightly called out or genuinely curious by the end of sentence two.

Don't signal what you're about to do ("First, we'll look at..."). Just do it.

Headers are fine but keep them lowercase and slightly conversational. Not "The Benefits of X" - more like "why this actually works" or "the thing nobody mentions."

End pieces abruptly-ish. Don't wrap up with a bow. The last line should feel like the end of a thought, not a conclusion.

## MINOR IMPERFECTIONS

Occasionally repeat a word in close proximity when it sounds natural (not as a mistake - as rhythm).

Sometimes a sentence fragment. On purpose.

Vary sentence length dramatically. One long one, two short ones, another long one that stretches out just a little bit longer than feels comfortable.

You can contradict yourself slightly, then acknowledge it. Real thinking does this.

The occasional "honestly" or "genuinely" is fine. Just not every paragraph.

One mild non-standard grammar choice per piece is fine - like starting with "And" or leaving a sentence technically incomplete - but only one, so it reads as style not error.

## OVERALL FEEL

If it reads like it could have been written by a content marketing team, rewrite it.

If it sounds like every other article on this topic, rewrite the opening.

The reader should feel like they're getting someone's actual opinion, not a summary of opinions that exist.

## OUTPUT FORMAT
Return your response as JSON with these fields:
- "title": a compelling blog title (max 80 chars), lowercase and conversational
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
      const imagePrompt = `You are a creative director generating an image for a blog post titled "${blog.title}". Create a photo that feels like it was taken by a person, not generated by a machine. The aesthetic is raw, specific and a little imperfect - not polished, not corporate, not stock. It should feel found, not produced. Like someone took a photo of something real and slightly unglamorous. Phone camera, natural light, slightly wrong angle, real environment with clutter in it. Colour grading subtle or non-existent. No oversaturated sunsets. No perfectly colour-matched flat-lays. Slight underexposure is more interesting than well-lit. Muted, a bit washed out or occasionally very high contrast - not "beautiful." Use a random colour profile or style every time - more blues, or reds or yellows depending on the image. Composition off-centre, partial frame, something half cut off at the edge. A hand in frame, an elbow, the corner of a room. Real spaces have edges. People if included should look like people - not models, slightly awkward poses, real skin, candid over directed, mixed ethnicities, normal clothes with a crease in them. Natural light only or low warm artificial light - a desk lamp, overhead fluorescent, a screen glow. Avoid golden hour, soft studio lighting, perfect window light. Instead overcast, overhead, slightly flat, harsh midday or dim evening. Encourage grain, slight motion blur, lens flare if there's a light source. Real surfaces like worn wood, slightly dirty concrete, dog-eared paper, scratched laminate. Not marble, not linen, not clean white backgrounds. Show an environment that looks used - a workspace, a half-drunk coffee, a bag dropped on a floor. Real context not a styled vignette. Text if relevant should look handwritten, printed badly or on a real surface. Shot on phone camera, natural grain, slightly underexposed. No text overlays, no studio lighting, no models, no branded elements.`;
      
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
        const message = imgData.choices?.[0]?.message;
        
        let base64Data: string | null = null;
        let mimeType = "image/png";
        
        // Check for images array on the message (Lovable AI gateway format)
        const images = message?.images || [];
        
        if (images.length > 0) {
          const img = images[0];
          const imgUrl = img.image_url?.url || img.url || img.image_url;
          
          
          if (typeof imgUrl === "string" && imgUrl.startsWith("data:")) {
            const dataUriMatch = imgUrl.match(/data:(image\/[^;]+);base64,(.+)/);
            if (dataUriMatch) {
              mimeType = dataUriMatch[1];
              base64Data = dataUriMatch[2];
            }
          } else if (typeof imgUrl === "string" && imgUrl.startsWith("http")) {
            // Direct URL - download it
            console.log("Downloading image from URL...");
            try {
              const dlResp = await fetch(imgUrl);
              if (dlResp.ok) {
                const ct = dlResp.headers.get("content-type") || "image/png";
                if (ct.startsWith("image/")) {
                  const imgBlob = await dlResp.blob();
                  const ext = ct.includes("png") ? "png" : "jpg";
                  const fileName = `${slug}.${ext}`;
                  const { error: uploadError } = await supabase.storage
                    .from("blog-images")
                    .upload(fileName, imgBlob, { contentType: ct, upsert: true });
                  if (!uploadError) {
                    const { data: publicUrlData } = supabase.storage
                      .from("blog-images")
                      .getPublicUrl(fileName);
                    coverImageUrl = publicUrlData.publicUrl;
                    console.log("AI image stored at:", coverImageUrl);
                  }
                }
              }
            } catch (e) {
              console.warn("Image URL download failed:", e);
            }
          } else if (img.data) {
            base64Data = img.data;
            mimeType = img.mime_type || img.content_type || "image/png";
          }
        }
        
        // Check parts (Gemini native format)
        if (!base64Data && !coverImageUrl) {
          const parts = message?.parts || [];
          for (const part of parts) {
            if (part.inline_data) {
              base64Data = part.inline_data.data;
              mimeType = part.inline_data.mime_type || "image/png";
              break;
            }
          }
        }
        
        // Check content for data URI
        if (!base64Data && !coverImageUrl && typeof message?.content === "string") {
          const dataUriMatch = message.content.match(/data:(image\/[^;]+);base64,([A-Za-z0-9+/=]+)/);
          if (dataUriMatch) {
            mimeType = dataUriMatch[1];
            base64Data = dataUriMatch[2];
          }
        }

        if (base64Data && !coverImageUrl) {
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
        published: true,
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

    // Post link to Slack
    try {
      const SLACK_BOT_TOKEN = Deno.env.get("SLACK_BOT_TOKEN");
      const SLACK_CHANNEL_ID = Deno.env.get("SLACK_CHANNEL_ID");
      if (SLACK_BOT_TOKEN && SLACK_CHANNEL_ID) {
        const blogUrl = `https://brand-voice-builder-09.lovable.app/blog/${slug}`;
        await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: SLACK_CHANNEL_ID,
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `📝 *New blog published:* <${blogUrl}|${blog.title}>\n${blog.excerpt || ""}`,
                },
              },
            ],
          }),
        });
      }
    } catch (slackErr) {
      console.warn("Slack notification failed:", slackErr);
    }

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
