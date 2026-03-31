-- Supabase setup for Users and Roles

-- 1. Create a custom enum type for user roles
CREATE TYPE user_role AS ENUM ('sin acceso', 'admin', 'superadmin');

-- 2. Create a 'profiles' table that extends the auth.users table
CREATE TABLE public.profiles (
  id uuid references auth.users not null primary key,
  role user_role default 'sin acceso'::user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS) on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create policies so users can read their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 5. Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'sin acceso');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
-- ==========================================
-- IMPORTANT: To resolve the PGRST116 error it means your user does not
-- exist in the 'profiles' table yet.
-- ==========================================
-- 1. Si te sale el error "PGRST116: Cannot coerce the result to a single JSON object",
--    es porque tu usuario fue creado ANTES de la tabla, y el sistema no le asignó rol.
-- 2. Ejecuta la siguiente sentencia en Supabase para insertar a tu usuario
--    directamente en los perfiles como 'superadmin' y solucionar el problema:

INSERT INTO public.profiles (id, role)
SELECT id, 'superadmin'
FROM auth.users
WHERE email = 'marcausente@gmail.com';
