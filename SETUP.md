# stolen.bio Production Setup Guide

This guide will help you set up stolen.bio for production deployment.

## Prerequisites

- A Supabase account and project
- Node.js 18+ installed
- A deployment platform (Vercel recommended)

## Database Setup

### 1. Create Supabase Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create invite_codes table
CREATE TABLE invite_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create user_profiles table (extends auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  bio_title TEXT,
  bio_description TEXT,
  bio_config JSONB DEFAULT '{}'::jsonb,
  social_links JSONB DEFAULT '[]'::jsonb,
  theme_config JSONB DEFAULT '{}'::jsonb,
  premium_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create analytics table
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'click', etc.
  event_data JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_is_active ON invite_codes(is_active);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invite_codes (admin only for creation/management)
CREATE POLICY "Invite codes are viewable by everyone for validation" ON invite_codes
  FOR SELECT USING (is_active = true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for analytics
CREATE POLICY "Users can view their own analytics" ON analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert analytics" ON analytics
  FOR INSERT WITH CHECK (true);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username)
  VALUES (new.id, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating timestamps
CREATE TRIGGER on_user_profiles_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

### 2. Create Initial Invite Codes

```sql
-- Insert some initial invite codes
INSERT INTO invite_codes (code, is_active) VALUES
  ('LAUNCH2024', true),
  ('BETA-ACCESS', true),
  ('CREATOR-001', true);
```

## Environment Variables

### 1. Development (.env)

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=development
```

### 2. Production (Vercel Environment Variables)

Set these in your Vercel dashboard:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NODE_ENV`: `production`

## Authentication Setup

### 1. Supabase Auth Configuration

In your Supabase dashboard > Authentication > Settings:

1. **Site URL**: Set to your production domain (e.g., `https://stolen.bio`)
2. **Redirect URLs**: Add your production domain and any development URLs
3. **Email Templates**: Customize the confirmation and recovery email templates
4. **SMTP Settings**: Configure your email provider for transactional emails

### 2. Email Confirmation

Enable email confirmation in Supabase Auth settings for production security.

## Deployment

### Vercel Deployment

1. Fork this repository
2. Connect your GitHub repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy

### Build Command

```bash
npm run build
```

### Development Server

```bash
npm run dev
```

## Admin Functions

### Managing Invite Codes

To create new invite codes, use the Supabase dashboard or create an admin interface:

```sql
-- Create new invite code
INSERT INTO invite_codes (code, is_active, created_by)
VALUES ('NEW-CODE-2024', true, 'admin-user-id');

-- Deactivate invite code
UPDATE invite_codes 
SET is_active = false 
WHERE code = 'OLD-CODE';

-- View invite code usage
SELECT 
  ic.code,
  ic.is_active,
  ic.created_at,
  ic.used_at,
  up.username as used_by_username
FROM invite_codes ic
LEFT JOIN user_profiles up ON ic.used_by = up.id
ORDER BY ic.created_at DESC;
```

## Security Considerations

1. **Environment Variables**: Never commit real environment variables to version control
2. **RLS Policies**: Ensure all tables have proper Row Level Security policies
3. **API Keys**: Use the Supabase anonymous key for client-side operations
4. **Email Verification**: Enable email confirmation in production
5. **Rate Limiting**: Consider implementing rate limiting for API endpoints

## Monitoring

- Monitor Supabase usage and performance in the dashboard
- Set up error tracking (Sentry recommended)
- Monitor invite code usage and user registrations
- Track analytics and user engagement

## Backup

- Supabase automatically backs up your database
- Consider setting up additional backups for critical data
- Regularly export invite codes and user data

## Support

For issues with setup:
1. Check the Supabase documentation
2. Verify environment variables are correctly set
3. Check browser console for any client-side errors
4. Review Supabase logs for server-side issues