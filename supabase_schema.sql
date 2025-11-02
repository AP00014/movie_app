-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Movies table
CREATE TABLE public.movies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT[] NOT NULL,
  country TEXT NOT NULL,
  release_date DATE NOT NULL,
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
  poster_url TEXT,
  trailer_url TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Music table
CREATE TABLE public.music (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  genre TEXT[] NOT NULL,
  release_date DATE NOT NULL,
  cover_url TEXT,
  preview_url TEXT,
  file_url TEXT,
  duration INTEGER, -- in seconds
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Games table
CREATE TABLE public.games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT[] NOT NULL,
  platform TEXT[] NOT NULL,
  release_date DATE NOT NULL,
  icon_url TEXT,
  cover_url TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Site settings table
CREATE TABLE public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Watchlist table
CREATE TABLE public.watchlist (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
   content_id TEXT NOT NULL,
   content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'series', 'music', 'game')),
   title TEXT NOT NULL,
   poster_url TEXT,
   year TEXT,
   rating TEXT,
   genre TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   UNIQUE(user_id, content_id, content_type)
);

-- Library table (for owned/downloaded content)
CREATE TABLE public.library (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
   content_id TEXT NOT NULL,
   content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'series', 'music', 'game')),
   title TEXT NOT NULL,
   poster_url TEXT,
   year TEXT,
   rating TEXT,
   genre TEXT,
   download_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   file_path TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   UNIQUE(user_id, content_id, content_type)
);

-- Audit log table
CREATE TABLE public.audit_log (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
   action TEXT NOT NULL,
   table_name TEXT NOT NULL,
   record_id UUID,
   old_values JSONB,
   new_values JSONB,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Function to check admin/editor role without recursion
CREATE OR REPLACE FUNCTION public.is_admin_or_editor(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND role IN ('admin', 'editor'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Movies policies
CREATE POLICY "Anyone can view published movies" ON public.movies
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins and editors can view all movies" ON public.movies
  FOR SELECT USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can insert movies" ON public.movies
  FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update movies" ON public.movies
  FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete movies" ON public.movies
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Music policies (similar to movies)
CREATE POLICY "Anyone can view published music" ON public.music
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins and editors can view all music" ON public.music
  FOR SELECT USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can insert music" ON public.music
  FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update music" ON public.music
  FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete music" ON public.music
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Games policies (similar to movies)
CREATE POLICY "Anyone can view published games" ON public.games
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins and editors can view all games" ON public.games
  FOR SELECT USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can insert games" ON public.games
  FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update games" ON public.games
  FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete games" ON public.games
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Site settings policies
CREATE POLICY "Admins can view site settings" ON public.site_settings
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR ALL USING (public.is_admin(auth.uid()));

-- Audit log policies
-- Watchlist policies
CREATE POLICY "Users can view their own watchlist" ON public.watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own watchlist" ON public.watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist" ON public.watchlist
  FOR DELETE USING (auth.uid() = user_id);

-- Library policies
CREATE POLICY "Users can view their own library" ON public.library
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own library" ON public.library
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own library" ON public.library
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view audit log" ON public.audit_log
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Functions for updating updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_movies
  BEFORE UPDATE ON public.movies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_music
  BEFORE UPDATE ON public.music
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_games
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_site_settings
   BEFORE UPDATE ON public.site_settings
   FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_watchlist
   BEFORE UPDATE ON public.watchlist
   FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_library
   BEFORE UPDATE ON public.library
   FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('posters', 'posters', true),
  ('music-covers', 'music-covers', true),
  ('game-assets', 'game-assets', true),
  ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Anyone can view posters" ON storage.objects
  FOR SELECT USING (bucket_id = 'posters');

CREATE POLICY "Admins can upload posters" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'posters' AND public.is_admin_or_editor(auth.uid())
  );

CREATE POLICY "Admins can update posters" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'posters' AND public.is_admin_or_editor(auth.uid())
  );

CREATE POLICY "Admins can delete posters" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'posters' AND public.is_admin(auth.uid())
  );

-- Similar policies for other buckets (music-covers, game-assets, avatars)
-- For brevity, implementing only for posters, but same pattern applies

CREATE POLICY "Anyone can view music covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'music-covers');

CREATE POLICY "Admins can upload music covers" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'music-covers' AND public.is_admin_or_editor(auth.uid())
  );

CREATE POLICY "Admins can update music covers" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'music-covers' AND public.is_admin_or_editor(auth.uid())
  );

CREATE POLICY "Admins can delete music covers" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'music-covers' AND public.is_admin(auth.uid())
  );

CREATE POLICY "Anyone can view game assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'game-assets');

CREATE POLICY "Admins can upload game assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'game-assets' AND public.is_admin_or_editor(auth.uid())
  );

CREATE POLICY "Admins can update game assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'game-assets' AND public.is_admin_or_editor(auth.uid())
  );

CREATE POLICY "Admins can delete game assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'game-assets' AND public.is_admin(auth.uid())
  );

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );