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
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- IMPORTANT: To create your first admin user
-- ==========================================
-- 1. Go to your Supabase Dashboard -> Authentication -> Users
-- 2. Click "Add User" -> "Create New User" 
-- 3. Enter email: admin@crafty.com and password: <YourSecurePassword>
-- 4. Supabase will automatically create a user in auth.users and a linked 'sin acceso' profile.
-- 5. Then, run the following SQL command to make them an admin:

-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@crafty.com');
