-- Ejecutar este código en el SQL Editor de Supabase

-- 1. Crear el Storage Bucket para las imágenes de la galería si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Crear las tablas principales
CREATE TABLE IF NOT EXISTS public.gallery_packs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id uuid REFERENCES public.gallery_packs(id) ON DELETE CASCADE,
  name text NOT NULL,
  image_url text NOT NULL,
  site_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Configurar RLS (Row Level Security) para las nuevas tablas
ALTER TABLE public.gallery_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura públicas (Cualquiera puede ver la galería)
CREATE POLICY "Public read access for gallery_packs" ON public.gallery_packs
  FOR SELECT USING (true);

CREATE POLICY "Public read access for gallery_images" ON public.gallery_images
  FOR SELECT USING (true);

-- Políticas de escritura solo para usuarios autenticados (Admin)
CREATE POLICY "Full access for authenticated users on gallery_packs" ON public.gallery_packs
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Full access for authenticated users on gallery_images" ON public.gallery_images
  FOR ALL TO authenticated USING (true);

-- 4. Configurar RLS para el Bucket de Storage
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload objects" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can update objects" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can delete objects" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'gallery');
