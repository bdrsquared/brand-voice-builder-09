import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  // Auth: shared API key in x-api-key header
  const provided = req.headers.get("x-api-key") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expected = Deno.env.get("BLOG_AGENT_API_KEY");
  if (!expected) return json(500, { error: "Server misconfigured" });
  if (!provided || provided !== expected) return json(401, { error: "Unauthorized" });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const method = req.method.toUpperCase();

  try {
    // LIST: GET /blog-agent
    if (method === "GET") {
      const url = new URL(req.url);
      const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 200);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, category, author, published, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) return json(500, { error: error.message });
      return json(200, { posts: data });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json(400, { error: "Invalid JSON body" });

    // CREATE: POST /blog-agent
    if (method === "POST") {
      const {
        title, content, slug, excerpt, category, author,
        cover_image, image_style, published,
        title_us, content_us, excerpt_us,
      } = body as Record<string, unknown>;

      if (typeof title !== "string" || title.trim().length < 3 || title.length > 300)
        return json(400, { error: "title required (3-300 chars)" });
      if (typeof content !== "string" || content.trim().length < 20)
        return json(400, { error: "content required (min 20 chars)" });
      if (author !== undefined && (typeof author !== "string" || author.length > 100))
        return json(400, { error: "author must be string <=100 chars" });

      const finalSlug = slugify(typeof slug === "string" && slug.trim() ? slug : title);

      const row: Record<string, unknown> = {
        title: title.trim(),
        slug: finalSlug,
        content,
        excerpt: typeof excerpt === "string" ? excerpt.slice(0, 500) : null,
        category: typeof category === "string" ? category.slice(0, 80) : null,
        author: typeof author === "string" ? author : "Earworm",
        cover_image: typeof cover_image === "string" ? cover_image : null,
        image_style: typeof image_style === "string" ? image_style : null,
        published: typeof published === "boolean" ? published : false,
        title_us: typeof title_us === "string" ? title_us : null,
        content_us: typeof content_us === "string" ? content_us : null,
        excerpt_us: typeof excerpt_us === "string" ? excerpt_us : null,
      };

      const { data, error } = await supabase.from("blog_posts").insert(row).select().single();
      if (error) return json(400, { error: error.message });
      return json(201, { post: data });
    }

    // UPDATE: PATCH /blog-agent  { id | slug, ...fields }
    if (method === "PATCH") {
      const { id, slug, ...rest } = body as Record<string, unknown>;
      if (!id && !slug) return json(400, { error: "id or slug required" });

      const allowed = [
        "title", "content", "excerpt", "category", "author", "cover_image",
        "image_style", "published", "title_us", "content_us", "excerpt_us", "slug",
      ];
      const updates: Record<string, unknown> = {};
      for (const k of allowed) if (k in rest) updates[k] = (rest as any)[k];
      if (updates.slug && typeof updates.slug === "string") updates.slug = slugify(updates.slug);
      if (Object.keys(updates).length === 0) return json(400, { error: "no updatable fields" });

      let q = supabase.from("blog_posts").update(updates);
      q = id ? q.eq("id", id as string) : q.eq("slug", slug as string);
      const { data, error } = await q.select().single();
      if (error) return json(400, { error: error.message });
      return json(200, { post: data });
    }

    return json(405, { error: "Method not allowed" });
  } catch (e) {
    return json(500, { error: (e as Error).message });
  }
});
