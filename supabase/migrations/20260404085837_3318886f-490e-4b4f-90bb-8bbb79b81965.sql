CREATE TABLE public.gojiberry_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  job_title TEXT,
  linkedin_url TEXT,
  source TEXT DEFAULT 'gojiberry',
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gojiberry_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage gojiberry contacts"
ON public.gojiberry_contacts FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow insert from service role"
ON public.gojiberry_contacts FOR INSERT TO anon
WITH CHECK (false);