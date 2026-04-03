
CREATE TABLE public.social_post_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  topic_type TEXT NOT NULL DEFAULT 'general',
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.social_post_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage social post topics"
  ON public.social_post_topics
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
