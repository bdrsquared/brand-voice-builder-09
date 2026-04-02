import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const SITE_URL = "https://uk.earworm.co";
const DEFAULT_TITLE = "Video Podcast Agency for B2B & Enterprise | Earworm";
const DEFAULT_DESC = "Earworm helps enterprise brands turn podcasting into a strategic content engine. Build authority, reach the right audience, and create high-quality video content that supports growth.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// Known social-media and messaging-app crawlers
const CRAWLER_AGENTS = [
  "slackbot", "twitterbot", "facebookexternalhit", "linkedinbot",
  "whatsapp", "telegrambot", "discordbot", "applebot",
  "googlebot", "bingbot", "imessagebot", "iframely",
  "embedly", "showyoubot", "outbrain", "pinterestbot",
  "quora link preview", "rogerbot", "vkshare", "w3c_validator",
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_AGENTS.some((bot) => ua.includes(bot));
}

function buildHtml(
  title: string,
  description: string,
  ogImage: string,
  canonicalUrl: string,
  redirectUrl: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />

  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Earworm" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  <meta name="twitter:site" content="@Earworm" />

  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
  <meta http-equiv="refresh" content="0;url=${escapeHtml(redirectUrl)}" />
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(redirectUrl)}">${escapeHtml(title)}</a>…</p>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";
  const canonicalUrl = `${SITE_URL}${path}`;
  const redirectUrl = canonicalUrl;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check user-agent — if not a crawler, just redirect
  const userAgent = req.headers.get("user-agent") || "";
  if (!isCrawler(userAgent)) {
    return new Response(null, {
      status: 302,
      headers: { Location: redirectUrl },
    });
  }

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESC;
  let ogImage = DEFAULT_OG_IMAGE;

  try {
    // 1. Check if it's a blog post
    const blogMatch = path.match(/^\/blog\/(.+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const { data: post } = await supabase
        .from("blog_posts")
        .select("title, excerpt, cover_image")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (post) {
        title = `${post.title} | Earworm`;
        description = post.excerpt || `Read "${post.title}" on the Earworm blog.`;
        if (post.cover_image) ogImage = post.cover_image;
      }
    }
    // 2. Check page_metadata table for all other pages
    else {
      const { data: meta } = await supabase
        .from("page_metadata")
        .select("meta_title, meta_description, og_title, og_description, og_image")
        .eq("page_path", path)
        .maybeSingle();

      if (meta) {
        title = meta.og_title || meta.meta_title || DEFAULT_TITLE;
        description = meta.og_description || meta.meta_description || DEFAULT_DESC;
        if (meta.og_image) ogImage = meta.og_image;
      }
    }
  } catch (err) {
    console.error("Error fetching meta data:", err);
    // Fall through to defaults
  }

  const html = buildHtml(title, description, ogImage, canonicalUrl, redirectUrl);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=600",
    },
  });
});
