
CREATE TABLE public.icp_landing_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icp_name TEXT NOT NULL,
  icp_description TEXT,
  research_data JSONB,
  generated_copy JSONB,
  slug TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.icp_landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage ICP landing pages"
ON public.icp_landing_pages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Published ICP pages are publicly readable"
ON public.icp_landing_pages
FOR SELECT
TO anon
USING (published = true);
