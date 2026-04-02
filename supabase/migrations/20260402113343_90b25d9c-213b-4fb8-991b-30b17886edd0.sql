
CREATE TABLE public.redirects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_path TEXT NOT NULL,
  to_path TEXT NOT NULL DEFAULT '/',
  status_code INTEGER NOT NULL DEFAULT 301,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(from_path)
);

ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage redirects" ON public.redirects
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can read redirects" ON public.redirects
  FOR SELECT TO anon, authenticated
  USING (true);
