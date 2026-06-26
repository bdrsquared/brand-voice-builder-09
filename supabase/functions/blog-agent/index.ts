import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// ---------- Table access policy ----------
// Each entry: what can be written, what identifies a row for PATCH, whether reads/writes are public.
type TableConfig = {
  writable: string[];               // columns allowed in POST/PATCH
  identifiers: string[];            // columns usable to locate a row for PATCH/DELETE
  allowDelete?: boolean;
  allowWrite?: boolean;             // POST/PATCH allowed
  slugSource?: string;              // column auto-slugified from another (e.g. slug from title)
};

const TABLES: Record<string, TableConfig> = {
  blog_posts: {
    writable: [
      "title", "slug", "content", "excerpt", "category", "author",
      "cover_image", "image_style", "published",
      "title_us", "content_us", "excerpt_us",
    ],
    identifiers: ["id", "slug"],
    allowWrite: true,
    slugSource: "title",
  },
  page_metadata: {
    writable: [
      "page_name", "page_path", "locale",
      "meta_title", "meta_description",
      "og_title", "og_description", "og_image",
    ],
    identifiers: ["id", "page_path"],
    allowWrite: true,
  },
  page_translations: {
    writable: [
      "page_path", "locale", "string_key",
      "source_text", "translated_text", "approved",
    ],
    identifiers: ["id"],
    allowWrite: true,
  },
  icp_landing_pages: {
    writable: [
      "icp_name", "icp_description", "slug",
      "page_style", "generated_copy", "research_data",
      "status", "published",
    ],
    identifiers: ["id", "slug"],
    allowWrite: true,
    slugSource: "icp_name",
  },
  redirects: {
    // read-only audit surface
    writable: [],
    identifiers: ["id", "from_path"],
    allowWrite: false,
  },
};

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);

const pickWritable = (cfg: TableConfig, body: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  for (const k of cfg.writable) if (k in body) out[k] = body[k];
  return out;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  // Auth: shared API key
  const provided = req.headers.get("x-api-key") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expected = Deno.env.get("BLOG_AGENT_API_KEY");
  if (!expected) return json(500, { error: "Server misconfigured" });
  if (!provided || provided !== expected) return json(401, { error: "Unauthorized" });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);
  const method = req.method.toUpperCase();

  try {
    // ---------- Discovery: list available tables + their writable columns ----------
    if (method === "GET" && url.searchParams.get("action") === "schema") {
      const out: Record<string, unknown> = {};
      for (const [name, cfg] of Object.entries(TABLES)) {
        out[name] = {
          writable_columns: cfg.writable,
          identifiers: cfg.identifiers,
          can_write: !!cfg.allowWrite,
        };
      }
      return json(200, { tables: out });
    }

    // ---------- Convenience: list of public routes for SEO crawling ----------
    if (method === "GET" && url.searchParams.get("action") === "routes") {
      const { data, error } = await supabase
        .from("page_metadata")
        .select("page_path, page_name, locale, meta_title, meta_description")
        .order("page_path");
      if (error) return json(500, { error: error.message });
      return json(200, { routes: data });
    }

    // ---------- Back-compat: GET with no ?table= still lists recent blog posts ----------
    const tableParam = url.searchParams.get("table") ?? (method === "GET" ? "blog_posts" : null);
    if (!tableParam) return json(400, { error: "table query param required" });
    const cfg = TABLES[tableParam];
    if (!cfg) return json(400, { error: `unknown table '${tableParam}'. Try ?action=schema` });

    // ---------- LIST / READ ----------
    if (method === "GET") {
      const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 500);
      const offset = Math.max(parseInt(url.searchParams.get("offset") ?? "0"), 0);
      const select = url.searchParams.get("select") ?? "*";

      let q = supabase.from(tableParam).select(select).range(offset, offset + limit - 1);

      // Filter by any identifier passed in querystring (e.g. ?slug=foo, ?page_path=/about)
      for (const idCol of cfg.identifiers) {
        const v = url.searchParams.get(idCol);
        if (v) q = q.eq(idCol, v);
      }
      // Order if created_at exists in the table; harmless otherwise
      q = q.order("created_at", { ascending: false } as never);

      const { data, error } = await q;
      if (error) return json(400, { error: error.message });
      return json(200, { table: tableParam, rows: data });
    }

    // ---------- WRITE ----------
    if (!cfg.allowWrite) return json(403, { error: `table '${tableParam}' is read-only` });

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json(400, { error: "Invalid JSON body" });

    if (method === "POST") {
      const row = pickWritable(cfg, body as Record<string, unknown>);

      // Per-table validation
      if (tableParam === "blog_posts") {
        if (typeof row.title !== "string" || row.title.trim().length < 3)
          return json(400, { error: "title required (min 3 chars)" });
        if (typeof row.content !== "string" || row.content.trim().length < 20)
          return json(400, { error: "content required (min 20 chars)" });
        if (!row.author) row.author = "Earworm";
      }
      if (tableParam === "page_metadata") {
        if (typeof row.page_path !== "string" || !row.page_path.startsWith("/"))
          return json(400, { error: "page_path required, must start with /" });
        if (typeof row.page_name !== "string" || row.page_name.length < 1)
          return json(400, { error: "page_name required" });
      }
      if (tableParam === "icp_landing_pages") {
        if (typeof row.icp_name !== "string" || row.icp_name.trim().length < 2)
          return json(400, { error: "icp_name required" });
      }

      // Auto-slug if applicable and missing
      if (cfg.slugSource && !row.slug && typeof row[cfg.slugSource] === "string") {
        row.slug = slugify(row[cfg.slugSource] as string);
      } else if (typeof row.slug === "string") {
        row.slug = slugify(row.slug);
      }

      const { data, error } = await supabase.from(tableParam).insert(row).select().single();
      if (error) return json(400, { error: error.message });
      return json(201, { table: tableParam, row: data });
    }

    if (method === "PATCH") {
      const { ...rest } = body as Record<string, unknown>;
      // Locate row by any identifier
      const idCol = cfg.identifiers.find((c) => c in rest && (rest as any)[c] != null);
      if (!idCol) return json(400, { error: `must include one of: ${cfg.identifiers.join(", ")}` });
      const idVal = (rest as any)[idCol];

      const updates = pickWritable(cfg, rest);
      if (typeof updates.slug === "string") updates.slug = slugify(updates.slug);
      if (Object.keys(updates).length === 0)
        return json(400, { error: "no updatable fields supplied" });

      const { data, error } = await supabase
        .from(tableParam).update(updates).eq(idCol, idVal).select().single();
      if (error) return json(400, { error: error.message });
      return json(200, { table: tableParam, row: data });
    }

    if (method === "DELETE") {
      if (!cfg.allowDelete) return json(403, { error: "delete not allowed on this table" });
      const idCol = cfg.identifiers.find((c) => url.searchParams.get(c));
      if (!idCol) return json(400, { error: `must include one of: ${cfg.identifiers.join(", ")}` });
      const { error } = await supabase.from(tableParam).delete().eq(idCol, url.searchParams.get(idCol)!);
      if (error) return json(400, { error: error.message });
      return json(200, { ok: true });
    }

    return json(405, { error: "Method not allowed" });
  } catch (e) {
    return json(500, { error: (e as Error).message });
  }
});
