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

    // Cooldown after blog text generation to avoid rate limits
    console.log("Waiting 15s before image generation to avoid rate limits...");
    await new Promise(r => setTimeout(r, 15000));

    // Step 3: Two-step image generation — pick style, then generate
    const STYLE_PROMPTS: Record<string, { prompt: string; negative: string }> = {
      vibrant_studio: {
        prompt: `Solid vibrant backdrop, single bold colour — electric magenta, acid green, cobalt, or deep orange. One person centre frame, shot from the waist up or face only. Expression is exaggerated and readable at thumbnail size: surprised, horrified, unimpressed, delighted. The expression should feel like a reaction meme, not a portrait. Face takes up most of the frame. Skin is real — pores, natural imperfections, no retouching. Colours are supersaturated but the image itself is still photographic, not illustrated. No props, no text, nothing else in frame. The backdrop is flat — no gradient, no texture, just one loud colour. Slightly harsh front-on lighting so nothing is mysterious. Shot on a mirrorless camera with a 50mm lens, shallow depth of field, face sharp, backdrop soft.`,
        negative: `no text overlays, no gradient backgrounds, no multiple people, no smiling-at-camera, no studio glamour retouching, no vignette`,
      },
      glossy_3d: {
        prompt: `Hyper-glossy CGI render, intentionally over-produced. Objects should look like they are made of polished resin, chrome, or thick frosted glass. Impossible lighting — multiple coloured light sources, reflections that don't make physical sense, subsurface glow. The palette should feel curated: either monochromatic with one accent, or a specific two-colour combination like deep navy and acid yellow. Depth of field even though nothing would realistically have depth of field in a render. Everything too smooth, too shiny, too perfect — but in an interesting way, not a boring way. The object or subject sits alone in a void or on a reflective surface. Nothing natural or organic. Pure artifice. Rendered in Cinema 4D or Blender aesthetic, octane render style, 4k, no camera grain.`,
        negative: `no photorealism, no natural settings, no flat design, no hand-drawn elements, no stock imagery feel`,
      },
      iphone_photo: {
        prompt: `A genuinely bad phone photo. Not artfully bad — just how bad phone photos actually look. Slightly soft focus because someone moved. Overhead fluorescent or mixed indoor lighting, no white balance correction. Slightly blown-out highlights on one side. Off-centre to the point of looking like an accident. Something partially in frame that shouldn't be — an elbow, a thumb over the lens corner, the edge of a table. The subject is mundane: a desk, an object, a person looking at something else. JPEG compression visible at edges. Colours are slightly wrong — too warm or too green depending on the light source. This should look like a photo someone sent in a group chat, not to an editor. Shot on iPhone 11 or older, automatic mode, no editing, portrait mode off.`,
        negative: `no golden hour, no professional framing, no sharp focus, no beautiful light, no intentional composition, no editing`,
      },
      meme_face: {
        prompt: `Bold flat-colour background — one colour, maximally saturated, chosen for emotional energy (yellow for chaos, red for alarm, green for cursed energy, blue for sadness). A single face takes up 60-70% of the frame. Expression is one emotion taken to its logical extreme: absolute despair, unhinged glee, deep suspicion, profound confusion. The face should be the kind of face that works as a reaction image — readable, specific, funny without trying. Slightly low resolution aesthetic, like it's been screenshotted and re-uploaded. No text. No other elements. The face does all the work. If there is a body it is cut off at the shoulders. Flat graphic, strong outline, no background detail, expression over everything.`,
        negative: `no text, no busy backgrounds, no multiple subjects, no calm expressions, no professional photography lighting, no stock photo energy`,
      },
      editorial_flat: {
        prompt: `Editorial magazine aesthetic. Single muted background colour — warm off-white, dusty rose, sage, faded terracotta, or deep forest green. One or two objects arranged with deliberate negative space. The composition is considered but not obsessive — something might be very slightly to the left of centre. Colours are all from the same family, desaturated. Shadows are real and visible. Nothing is floating: objects sit on a surface with proper contact shadows. If there is text it is printed on something in the image, not overlaid digitally. Quiet. Shot on medium format, flat lay or 3/4 angle, natural overcast light.`,
        negative: `no vibrant colours, no people, no branding, no digital text overlays, no studio lighting, no centred symmetrical compositions`,
      },
      grainy_disposable: {
        prompt: `Disposable camera aesthetic, early 2000s. Heavy grain throughout — not digital noise, actual film grain. Colours are warm and slightly wrong: reds bleed, whites go cream, blacks go dark brown. Slight vignette at the corners from the cheap lens. Flash if it's a low-light situation — the harsh flat flash that makes everyone look caught, not lit. Overexposed or underexposed, not correctly exposed. The subject is people in a real situation: at a table, outside, caught mid-sentence, laughing at something off frame. Nothing is composed. Kodak Gold or Fuji 200 film emulation, 35mm, developed at a drugstore.`,
        negative: `no clean digital look, no sharp focus, no studio, no posed subjects, no colour grading, no modern camera quality`,
      },
    };

    let coverImageUrl: string | null = null;
    let chosenStyle: string | null = null;
    try {
      // Step 3a: Randomly pick a style — crypto-random, strict dedup
      const styleKeys = Object.keys(STYLE_PROMPTS);
      
      // Look back further to avoid clustering
      const { data: recentPosts } = await supabase
        .from("blog_posts")
        .select("image_style")
        .not("image_style", "is", null)
        .order("created_at", { ascending: false })
        .limit(10);
      
      const recentStyles = (recentPosts || []).map(p => p.image_style).filter(Boolean);
      
      // Count how often each style appears in recent posts
      const styleCounts: Record<string, number> = {};
      for (const s of styleKeys) styleCounts[s] = 0;
      for (const s of recentStyles) if (styleCounts[s] !== undefined) styleCounts[s]++;
      
      // Find the minimum count and only allow styles at that count (least used)
      const minCount = Math.min(...Object.values(styleCounts));
      let availableStyles = styleKeys.filter(s => styleCounts[s] === minCount);
      if (availableStyles.length === 0) availableStyles = styleKeys;
      
      // Crypto-random selection
      const randomBytes = new Uint32Array(1);
      crypto.getRandomValues(randomBytes);
      chosenStyle = availableStyles[randomBytes[0] % availableStyles.length];
      console.log(`Style chosen: ${chosenStyle} (counts: ${JSON.stringify(styleCounts)}, pool: ${availableStyles.join(", ")})`);

      const styleConfig = STYLE_PROMPTS[chosenStyle!];
      
      // Use AI only to describe what subject should be in the image
      const subjectResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "user",
                content: `Based on this blog title and excerpt, describe in 1-2 sentences what the subject of the image should be. Be specific and visual. No style direction, just the subject.

TITLE: ${blog.title}
EXCERPT: ${blog.excerpt}

Respond with ONLY the subject description, nothing else.`,
              },
            ],
          }),
        }
      );

      let subjectDescription = blog.title;
      if (subjectResponse.ok) {
        const subjectData = await subjectResponse.json();
        subjectDescription = subjectData.choices?.[0]?.message?.content?.trim() || blog.title;
      }

      const fullPrompt = `${styleConfig.prompt}\n\nThe subject of this image: ${subjectDescription}\n\n${styleConfig.negative}`;

      console.log("Step 3b: Generating image with chosen style...");
      
      // Retry logic for rate limits
      let imgResponse: Response | null = null;
      const maxRetries = 3;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        imgResponse = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3.1-flash-image-preview",
              messages: [{ role: "user", content: fullPrompt }],
              modalities: ["image", "text"],
            }),
          }
        );
        
        if (imgResponse.status !== 429) break;
        
        const waitSecs = (attempt + 1) * 10; // 10s, 20s, 30s
        console.log(`Image generation rate limited (attempt ${attempt + 1}/${maxRetries}), waiting ${waitSecs}s...`);
        await new Promise(r => setTimeout(r, waitSecs * 1000));
      }

      if (imgResponse && imgResponse.ok) {
        const imgData = await imgResponse.json();
        const message = imgData.choices?.[0]?.message;
        
        let base64Data: string | null = null;
        let mimeType = "image/png";
        
        // Check for images array (Lovable AI gateway format)
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
        }
      } else {
        console.warn("Image generation failed:", imgResponse.status, await imgResponse.text());
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
        image_style: chosenStyle,
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
