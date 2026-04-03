ALTER TABLE public.social_post_topics 
  ADD COLUMN IF NOT EXISTS research_data jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deep_research_data jsonb DEFAULT NULL;