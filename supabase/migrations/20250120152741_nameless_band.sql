/*
  # Storage policies for template images

  1. Storage Policies
    - Create template-images bucket if it doesn't exist
    - Enable public access for authenticated users
    - Set appropriate RLS policies for image management
*/

-- Create storage bucket for template images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('template-images', 'template-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'template-images' AND
  auth.role() = 'authenticated'
);

-- Allow public access to view images
CREATE POLICY "Allow public to view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'template-images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Allow users to delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'template-images' AND auth.uid() = owner);