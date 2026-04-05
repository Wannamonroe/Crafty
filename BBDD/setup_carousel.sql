-- 1. Create table for carousel images
CREATE TABLE IF NOT EXISTS public.carousel_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    "order" INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable row level security
ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for public access (READ ALL)
CREATE POLICY "Public carousel read access" 
ON public.carousel_images 
FOR SELECT 
USING (true);

-- 4. Create policies for admin access (ALL)
CREATE POLICY "Admin carousel full access" 
ON public.carousel_images 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Storage Policies (Run these in the SQL editor to allow uploads to the 'carousel' bucket)

-- Allow public read access to carousel images
CREATE POLICY "Carousel Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'carousel');

-- Allow authenticated users to upload images
CREATE POLICY "Carousel Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'carousel');

-- Allow authenticated users to delete images
CREATE POLICY "Carousel Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'carousel');

-- Allow authenticated users to update images
CREATE POLICY "Carousel Admin Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'carousel');
