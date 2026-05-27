import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Currency } from "@/lib/fx";

export type Locale = "en-GB" | "en-US";

interface LocaleContextValue {
  locale: Locale;
  currency: Currency;
  isUS: boolean;
  /** Prepend /us to an internal path when in the US locale. Safe to call with absolute or hash paths. */
  localizePath: (path: string) => string;
  /** Toggle a path between its UK and US equivalents. */
  toggleLocalePath: (path: string, target: Locale) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectLocale(pathname: string): Locale {
  return pathname === "/us" || pathname.startsWith("/us/") ? "en-US" : "en-GB";
}

function stripUsPrefix(path: string): string {
  if (path === "/us") return "/";
  if (path.startsWith("/us/")) return path.slice(3);
  return path;
}

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const locale = detectLocale(pathname);

  const value = useMemo<LocaleContextValue>(() => {
    const isUS = locale === "en-US";
    const localizePath = (path: string) => {
      if (!path || !path.startsWith("/")) return path;
      if (!isUS) return path;
      if (path === "/" ) return "/us";
      if (path.startsWith("/us")) return path;
      // Don't localize admin / thank-you / lovable / form-action surfaces
      if (
        path.startsWith("/admin") ||
        path.startsWith("/lovable") ||
        path.startsWith("/thank-you")
      ) return path;
      return `/us${path}`;
    };
    const toggleLocalePath = (path: string, target: Locale) => {
      const ukPath = stripUsPrefix(path);
      if (target === "en-GB") return ukPath;
      return ukPath === "/" ? "/us" : `/us${ukPath}`;
    };
    return {
      locale,
      currency: isUS ? "USD" : "GBP",
      isUS,
      localizePath,
      toggleLocalePath,
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Safe fallback so components used outside a provider still render.
    return {
      locale: "en-GB",
      currency: "GBP",
      isUS: false,
      localizePath: (p) => p,
      toggleLocalePath: (p) => p,
    };
  }
  return ctx;
}
