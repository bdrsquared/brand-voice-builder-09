import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PageViewTracker = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    // Avoid duplicate logs for same path
    if (path === lastPath.current) return;
    lastPath.current = path;

    // Don't track admin pages
    if (path.startsWith("/admin")) return;

    supabase
      .from("page_views")
      .insert({
        page_path: path,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent || null,
      } as any)
      .then(() => {});
  }, [location.pathname]);

  return null;
};

export default PageViewTracker;
