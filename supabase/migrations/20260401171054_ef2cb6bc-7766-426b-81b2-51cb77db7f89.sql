
CREATE POLICY "Admins can update inquiries"
  ON public.inquiries
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
