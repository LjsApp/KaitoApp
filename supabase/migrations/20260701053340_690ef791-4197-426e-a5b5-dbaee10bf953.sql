
CREATE POLICY "public-media read" ON storage.objects FOR SELECT USING (bucket_id = 'public-media');
