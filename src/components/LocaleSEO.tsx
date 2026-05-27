import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

const SITE_ORIGIN = "https://earworm.co";

/**
 * Drops hreflang alternates + a self-canonical for the current route into <head>.
 * Mounted once at the app root so every page gets correct SEO without per-page work.
 */
const LocaleSEO = () => {
  const { pathname } = useLocation();
  const { isUS } = useLocale();

  // Compute UK + US equivalents of the current path
  const ukPath = pathname === "/us"
    ? "/"
    : pathname.startsWith("/us/")
      ? pathname.slice(3)
      : pathname;
  const usPath = ukPath === "/" ? "/us" : `/us${ukPath}`;

  const ukUrl = `${SITE_ORIGIN}${ukPath}`;
  const usUrl = `${SITE_ORIGIN}${usPath}`;
  const canonical = isUS ? usUrl : ukUrl;

  return (
    <Helmet>
      <html lang={isUS ? "en-US" : "en-GB"} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en-GB" href={ukUrl} />
      <link rel="alternate" hrefLang="en-US" href={usUrl} />
      <link rel="alternate" hrefLang="x-default" href={ukUrl} />
    </Helmet>
  );
};

export default LocaleSEO;
