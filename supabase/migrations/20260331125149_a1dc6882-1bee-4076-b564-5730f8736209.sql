
CREATE TABLE public.page_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL UNIQUE,
  page_name text NOT NULL,
  meta_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage page metadata"
  ON public.page_metadata FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can read page metadata"
  ON public.page_metadata FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed with existing pages
INSERT INTO public.page_metadata (page_path, page_name) VALUES
  ('/', 'Home'),
  ('/our-story', 'Our Story'),
  ('/book-a-call', 'Book a Call'),
  ('/case-study/brand-voice', 'Case Study'),
  ('/cookies-policy', 'Cookies Policy'),
  ('/blogs', 'Blog');
