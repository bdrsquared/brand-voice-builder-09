import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildImagePrompts(icpName: string, researchText: string): string {
  return `You are a creative director generating landing page photography briefs. Using the ICP and research provided, generate image generation prompts that feel like candid editorial photography — not stock, not AI-generated. Prioritise naturalism, specificity, and brand authenticity over polish.

Image generation prompt structure to output for each image:

Scene: [specific real-world context relevant to the ICP]
Subject: [specific person type matching ICP — age, role, environment, not generic]
Mood/lighting: editorial, natural window light / overcast outdoor light / warm indoor ambient — no studio lighting
Composition: slightly off-centre, candid framing, not posed
Technical style: shot on 35mm film, Kodak Portra 400, f/1.8 aperture, slight grain, muted tones, shallow depth of field
What to avoid: stock photo poses, perfect symmetry, AI smoothness, oversaturation, lens flares

My ICP: ${icpName}

Research: ${researchText}

Generate 5 image prompts for these sections of the landing page:
1. hero — the main hero image
2. social_proof — showing the ICP in their element, successful
3. feature — showing the production/content process
4. problem — visualising the content challenge they face
5. solution — showing the outcome/transformation

Return ONLY valid JSON array with exactly 5 objects:
[
  { "section": "hero", "prompt": "full detailed prompt text" },
  { "section": "social_proof", "prompt": "full detailed prompt text" },
  { "section": "feature", "prompt": "full detailed prompt text" },
  { "section": "problem", "prompt": "full detailed prompt text" },
  { "section": "solution", "prompt": "full detailed prompt text" }
]

No markdown fences. No explanation. Just the JSON array.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

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

    const { icp_id, icp_name, research_data } = await req.json();
    if (!icp_id || !icp_name || !research_data) {
      throw new Error("icp_id, icp_name, and research_data are required");
    }

    const researchText = typeof research_data === "string" ? research_data : JSON.stringify(research_data);

    // Step 1: Generate image prompts using AI
    console.log("Generating image prompts for", icp_name);
    const promptResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a creative director. Return only valid JSON arrays. No markdown." },
          { role: "user", content: buildImagePrompts(icp_name, researchText) },
        ],
      }),
    });

    if (!promptResponse.ok) {
      const errText = await promptResponse.text();
      console.error("AI prompt error:", promptResponse.status, errText);
      throw new Error(`AI prompt generation failed: ${promptResponse.status}`);
    }

    const promptData = await promptResponse.json();
    let promptContent = promptData.choices?.[0]?.message?.content;
    if (!promptContent) throw new Error("No prompts returned from AI");

    promptContent = promptContent.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "").trim();

    let imagePrompts: Array<{ section: string; prompt: string }>;
    try {
      imagePrompts = JSON.parse(promptContent);
    } catch {
      console.error("Failed to parse prompts:", promptContent.slice(0, 500));
      throw new Error("AI returned invalid JSON for prompts");
    }

    if (!Array.isArray(imagePrompts) || imagePrompts.length < 5) {
      throw new Error("Expected 5 image prompts, got " + (imagePrompts?.length || 0));
    }

    // Step 2: Generate each image
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const generatedImages: Record<string, string> = {};

    for (const item of imagePrompts.slice(0, 5)) {
      console.log(`Generating image for section: ${item.section}`);
      try {
        const imgResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              { role: "user", content: item.prompt },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (!imgResponse.ok) {
          console.error(`Image generation failed for ${item.section}:`, imgResponse.status);
          continue;
        }

        const imgData = await imgResponse.json();
        const imageUrl = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (!imageUrl) {
          console.error(`No image returned for ${item.section}`);
          continue;
        }

        // Extract base64 data and upload to storage
        const base64Match = imageUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
        if (!base64Match) {
          console.error(`Invalid image format for ${item.section}`);
          continue;
        }

        const ext = base64Match[1] === "jpeg" ? "jpg" : base64Match[1];
        const base64Data = base64Match[2];
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        const filePath = `icp/${icp_id}/${item.section}.${ext}`;
        const { error: uploadError } = await adminSupabase.storage
          .from("icp-images")
          .upload(filePath, binaryData, {
            contentType: `image/${base64Match[1]}`,
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload failed for ${item.section}:`, uploadError);
          continue;
        }

        const { data: publicUrlData } = adminSupabase.storage
          .from("icp-images")
          .getPublicUrl(filePath);

        generatedImages[item.section] = publicUrlData.publicUrl;
        console.log(`✓ ${item.section} uploaded: ${filePath}`);
      } catch (imgErr) {
        console.error(`Error generating ${item.section}:`, imgErr);
      }
    }

    // Step 3: Save image URLs to the ICP record
    const { data: existingPage } = await adminSupabase
      .from("icp_landing_pages")
      .select("research_data")
      .eq("id", icp_id)
      .single();

    const currentResearch = existingPage?.research_data || {};
    const updatedResearch = {
      ...currentResearch,
      generated_images: generatedImages,
    };

    const { error: updateError } = await adminSupabase
      .from("icp_landing_pages")
      .update({
        research_data: updatedResearch,
        updated_at: new Date().toISOString(),
      })
      .eq("id", icp_id);

    if (updateError) {
      console.error("DB update error:", updateError);
      throw new Error("Failed to save image URLs");
    }

    return new Response(
      JSON.stringify({
        success: true,
        images: generatedImages,
        count: Object.keys(generatedImages).length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (e) {
    console.error("generate-icp-images error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
