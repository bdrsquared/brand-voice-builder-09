INSERT INTO storage.buckets (id, name, public) VALUES ('icp-images', 'icp-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "ICP images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'icp-images');

CREATE POLICY "Admins can upload ICP images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'icp-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ICP images" ON storage.objects FOR UPDATE USING (bucket_id = 'icp-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ICP images" ON storage.objects FOR DELETE USING (bucket_id = 'icp-images' AND public.has_role(auth.uid(), 'admin'));