
-- page_translations: cached US translations of UI strings
CREATE TABLE public.page_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  string_key TEXT NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en-US',
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (locale, page_path, string_key)
);

GRANT SELECT ON public.page_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_translations TO authenticated;
GRANT ALL ON public.page_translations TO service_role;

ALTER TABLE public.page_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved translations"
  ON public.page_translations FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Admins can manage translations"
  ON public.page_translations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_page_translations_lookup
  ON public.page_translations (locale, page_path, approved);

-- page_metadata: add nullable locale column (NULL = applies to all locales)
ALTER TABLE public.page_metadata
  ADD COLUMN IF NOT EXISTS locale TEXT;

CREATE INDEX IF NOT EXISTS idx_page_metadata_path_locale
  ON public.page_metadata (page_path, locale);

-- blog_posts: add US content column (nullable)
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS content_us TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_us TEXT,
  ADD COLUMN IF NOT EXISTS title_us TEXT;
