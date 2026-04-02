-- Ejecutar este código en el SQL Editor de Supabase

-- Tabla de configuración general del sitio (clave-valor)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Lectura pública (el footer la necesita sin login)
CREATE POLICY "Public read access for site_settings" ON public.site_settings
  FOR SELECT USING (true);

-- Sólo admins autenticados pueden escribir
CREATE POLICY "Full access for authenticated users on site_settings" ON public.site_settings
  FOR ALL TO authenticated USING (true);

-- Valores por defecto para los 4 botones del footer
INSERT INTO public.site_settings (key, value) VALUES
  ('footer_facebook_album',  'https://www.facebook.com'),
  ('footer_facebook_group',  'https://www.facebook.com'),
  ('footer_inworld_group',   'https://secondlife.com'),
  ('footer_seraphim_gallery','https://seraphimsl.com')
ON CONFLICT (key) DO NOTHING;
