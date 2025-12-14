-- ============================================
-- SUPABASE AUTH SCHEMA FOR MOVIE APP
-- ============================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- ============================================
-- 0. ROLE ENUM TYPE
-- ============================================
-- Define user roles: user (default), admin, superadmin

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');
    END IF;
END $$;

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Stores extended user information beyond what Supabase Auth provides
-- This table is linked to auth.users via the id field

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN public.profiles.role IS 'User role: user (default), admin, or superadmin';

-- ============================================
-- 2. HELPER FUNCTIONS FOR ROLE CHECKING
-- ============================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Function to check if current user is admin or superadmin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'superadmin')
    );
$$;

-- Function to check if current user is superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'superadmin'
    );
$$;

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy: Admins and Superadmins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());

-- Policy: Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND (
        -- Regular users cannot change their own role
        role = (SELECT role FROM public.profiles WHERE id = auth.uid())
        OR public.is_superadmin()
    )
);

-- Policy: Superadmins can update any profile (including roles)
CREATE POLICY "Superadmins can update all profiles"
ON public.profiles
FOR UPDATE
USING (public.is_superadmin());

-- Policy: Users can insert their own profile (for new signups)
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- 4. TRIGGER: AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
-- This function automatically creates a profile when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, date_of_birth, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        (NEW.raw_user_meta_data->>'date_of_birth')::DATE,
        'user'  -- Default role for new signups
    );
    RETURN NEW;
END;
$$;

-- Create trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. TRIGGER: UPDATE UPDATED_AT TIMESTAMP
-- ============================================
-- Automatically updates the updated_at field when profile is modified

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at DESC);

-- ============================================
-- 7. ADMIN MANAGEMENT FUNCTIONS
-- ============================================

-- Function to promote a user to admin (only superadmins can do this)
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if caller is superadmin
    IF NOT public.is_superadmin() THEN
        RAISE EXCEPTION 'Only superadmins can promote users to admin';
    END IF;
    
    UPDATE public.profiles 
    SET role = 'admin', updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN FOUND;
END;
$$;

-- Function to demote an admin to user (only superadmins can do this)
CREATE OR REPLACE FUNCTION public.demote_to_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if caller is superadmin
    IF NOT public.is_superadmin() THEN
        RAISE EXCEPTION 'Only superadmins can demote admins';
    END IF;
    
    -- Cannot demote superadmins
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id AND role = 'superadmin') THEN
        RAISE EXCEPTION 'Cannot demote a superadmin';
    END IF;
    
    UPDATE public.profiles 
    SET role = 'user', updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN FOUND;
END;
$$;

-- Function to deactivate a user (admins and superadmins can do this)
CREATE OR REPLACE FUNCTION public.deactivate_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if caller is admin or superadmin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can deactivate users';
    END IF;
    
    -- Cannot deactivate superadmins unless you are a superadmin
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id AND role = 'superadmin') THEN
        IF NOT public.is_superadmin() THEN
            RAISE EXCEPTION 'Only superadmins can deactivate other superadmins';
        END IF;
    END IF;
    
    UPDATE public.profiles 
    SET is_active = FALSE, updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN FOUND;
END;
$$;

-- Function to reactivate a user
CREATE OR REPLACE FUNCTION public.reactivate_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can reactivate users';
    END IF;
    
    UPDATE public.profiles 
    SET is_active = TRUE, updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN FOUND;
END;
$$;

-- ============================================
-- 8. WATCHLIST TABLE
-- ============================================
-- For saving movies/series to user's watchlist

CREATE TABLE IF NOT EXISTS public.watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_id TEXT NOT NULL,  -- Movie or series ID
    content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'series', 'animation', 'short')),
    title TEXT NOT NULL,
    poster_url TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id, content_type)
);

-- Enable RLS on watchlist
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own watchlist
CREATE POLICY "Users can view own watchlist"
ON public.watchlist
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admins can view all watchlists
CREATE POLICY "Admins can view all watchlists"
ON public.watchlist
FOR SELECT
USING (public.is_admin());

-- Policy: Users can add to their own watchlist
CREATE POLICY "Users can add to own watchlist"
ON public.watchlist
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove from their own watchlist
CREATE POLICY "Users can delete from own watchlist"
ON public.watchlist
FOR DELETE
USING (auth.uid() = user_id);

-- Index for watchlist queries
CREATE INDEX IF NOT EXISTS watchlist_user_id_idx ON public.watchlist(user_id);
CREATE INDEX IF NOT EXISTS watchlist_added_at_idx ON public.watchlist(added_at DESC);

-- ============================================
-- 9. WATCH HISTORY TABLE
-- ============================================
-- For tracking what users have watched

CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_id TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'series', 'animation', 'short')),
    title TEXT NOT NULL,
    poster_url TEXT,
    progress_seconds INT DEFAULT 0,  -- How far they watched
    duration_seconds INT,            -- Total duration
    watched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id, content_type)
);

-- Enable RLS
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own history
CREATE POLICY "Users can view own watch history"
ON public.watch_history
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admins can view all watch history
CREATE POLICY "Admins can view all watch history"
ON public.watch_history
FOR SELECT
USING (public.is_admin());

-- Policy: Users can add/update their own history
CREATE POLICY "Users can upsert own watch history"
ON public.watch_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history"
ON public.watch_history
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own history
CREATE POLICY "Users can delete own watch history"
ON public.watch_history
FOR DELETE
USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS watch_history_user_id_idx ON public.watch_history(user_id);
CREATE INDEX IF NOT EXISTS watch_history_watched_at_idx ON public.watch_history(watched_at DESC);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.watchlist TO authenticated;
GRANT ALL ON public.watch_history TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_superadmin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_to_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.demote_to_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.deactivate_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reactivate_user(UUID) TO authenticated;

-- Grant access for anon users (read-only for public data if needed)
GRANT USAGE ON SCHEMA public TO anon;

-- ============================================
-- 10. CREATE INITIAL SUPERADMIN (OPTIONAL)
-- ============================================
-- Run this AFTER you've signed up with your admin account
-- Replace 'your-email@example.com' with your actual email

-- UPDATE public.profiles 
-- SET role = 'superadmin' 
-- WHERE email = 'your-email@example.com';
