import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Redirect = {
  from_path: string;
  to_path: string;
};

const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [redirects, setRedirects] = useState<Redirect[] | null>(null);

  useEffect(() => {
    supabase
      .from("redirects")
      .select("from_path, to_path")
      .then(({ data }) => {
        if (data) setRedirects(data as Redirect[]);
      });
  }, []);

  useEffect(() => {
    if (!redirects) return;
    const path = location.pathname;
    // Try exact match, then with/without trailing slash
    const match = redirects.find(
      (r) =>
        r.from_path === path ||
        r.from_path === path + "/" ||
        r.from_path === path.replace(/\/$/, "")
    );
    if (match) {
      navigate(match.to_path, { replace: true });
    }
  }, [redirects, location.pathname, navigate]);

  return null;
};

export default RedirectHandler;
