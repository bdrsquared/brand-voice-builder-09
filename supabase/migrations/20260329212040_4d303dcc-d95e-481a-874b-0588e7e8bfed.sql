
-- Drop the permissive insert policy and replace with anon-denied version
DROP POLICY "Service role can insert inquiries" ON public.inquiries;

-- Only allow inserts from the service role (edge functions bypass RLS anyway)
-- So we can safely deny all authenticated/anon inserts via RLS
CREATE POLICY "Deny direct inserts"
  ON public.inquiries FOR INSERT
  TO authenticated, anon
  WITH CHECK (false);
