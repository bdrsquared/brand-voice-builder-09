import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_TITLE = "Video Podcast Agency for B2B & Enterprise | Earworm";
const DEFAULT_DESC = "Earworm helps enterprise brands turn podcasting into a strategic content engine. Build authority, reach the right audience, and create high-quality video content that supports growth.";
const DEFAULT_OG_IMAGE = "https://uk.earworm.co/og-image.png";
const SITE_URL = "https://uk.earworm.co";

interface MetaOverrides {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

const setMeta = (property: string, content: string, isName = false) => {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (url: string) => {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
};

/**
 * Fetches meta data from the page_metadata table for the current path,
 * with optional overrides for dynamic pages (blog posts, case studies).
 */
const useMetaTags = (overrides?: MetaOverrides) => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    // If overrides are provided (dynamic pages), use them directly
    if (overrides?.title) {
      const title = overrides.title;
      const description = overrides.description || DEFAULT_DESC;
      const ogTitle = overrides.ogTitle || title;
      const ogDescription = overrides.ogDescription || description;
      const ogImage = overrides.ogImage || DEFAULT_OG_IMAGE;

      document.title = title;
      setMeta("description", description, true);
      setMeta("og:title", ogTitle);
      setMeta("og:description", ogDescription);
      setMeta("og:image", ogImage);
      setMeta("og:url", `${SITE_URL}${path}`);
      setMeta("og:type", "website");
      setMeta("twitter:card", "summary_large_image", true);
      setMeta("twitter:title", ogTitle, true);
      setMeta("twitter:description", ogDescription, true);
      setMeta("twitter:image", ogImage, true);
      setCanonical(`${SITE_URL}${path}`);
      return;
    }

    // Fetch from page_metadata table
    const fetchMeta = async () => {
      const { data } = await supabase
        .from("page_metadata")
        .select("*")
        .eq("page_path", path)
        .maybeSingle();

      const title = data?.meta_title || DEFAULT_TITLE;
      const description = data?.meta_description || DEFAULT_DESC;
      const ogTitle = data?.og_title || title;
      const ogDescription = data?.og_description || description;
      const ogImage = data?.og_image || DEFAULT_OG_IMAGE;

      document.title = title;
      setMeta("description", description, true);
      setMeta("og:title", ogTitle);
      setMeta("og:description", ogDescription);
      setMeta("og:image", ogImage);
      setMeta("og:url", `${SITE_URL}${path}`);
      setMeta("og:type", "website");
      setMeta("twitter:card", "summary_large_image", true);
      setMeta("twitter:title", ogTitle, true);
      setMeta("twitter:description", ogDescription, true);
      setMeta("twitter:image", ogImage, true);
      setCanonical(`${SITE_URL}${path}`);
    };

    fetchMeta();

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [location.pathname, overrides?.title, overrides?.description, overrides?.ogImage]);
};

export default useMetaTags;
