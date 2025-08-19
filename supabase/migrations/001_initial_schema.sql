-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create invite_codes table
CREATE TABLE IF NOT EXISTS invite_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    uses_remaining INTEGER DEFAULT NULL, -- NULL means unlimited
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    membership_tier VARCHAR(20) DEFAULT 'elite',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(100) DEFAULT 'Elite Member',
    description TEXT DEFAULT 'Welcome to my exclusive elite biolink ✨',
    avatar TEXT DEFAULT NULL,
    background_media TEXT DEFAULT NULL,
    music_url TEXT DEFAULT NULL,
    address VARCHAR(100) DEFAULT NULL,
    favicon TEXT DEFAULT NULL,
    enter_text VARCHAR(50) DEFAULT 'Enter Elite Space',
    title_tab_text VARCHAR(100) DEFAULT NULL,
    show_badges BOOLEAN DEFAULT true,
    badges JSONB DEFAULT '["elite-member"]'::jsonb,
    social_links JSONB DEFAULT '[]'::jsonb,
    custom_links JSONB DEFAULT '[]'::jsonb,
    layout_type VARCHAR(20) DEFAULT 'square',
    accent_color VARCHAR(7) DEFAULT '#10b981',
    text_color VARCHAR(7) DEFAULT '#ffffff',
    background_color TEXT DEFAULT 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0f172a 100%)',
    icon_color VARCHAR(7) DEFAULT '#10b981',
    background_type VARCHAR(20) DEFAULT 'gradient',
    description_effect VARCHAR(20) DEFAULT 'glow',
    border_glow BOOLEAN DEFAULT true,
    glow_type VARCHAR(20) DEFAULT 'avatar',
    title_type VARCHAR(20) DEFAULT 'gradient',
    particles_enabled BOOLEAN DEFAULT true,
    particles_image TEXT DEFAULT NULL,
    particles_color VARCHAR(7) DEFAULT '#10b981',
    special_effects VARCHAR(20) DEFAULT 'elite',
    view_counter_enabled BOOLEAN DEFAULT true,
    view_counter_position VARCHAR(20) DEFAULT 'bottom-left',
    mouse_trails VARCHAR(20) DEFAULT 'elite',
    aliases TEXT DEFAULT NULL,
    custom_badge VARCHAR(50) DEFAULT 'ELITE',
    avatar_decoration VARCHAR(30) DEFAULT 'glow',
    membership_tier VARCHAR(20) DEFAULT 'elite',
    steal_coins INTEGER DEFAULT 200,
    affiliate_code VARCHAR(20) DEFAULT NULL,
    display_rank BOOLEAN DEFAULT true,
    milestone_notifications BOOLEAN DEFAULT true,
    elite_features BOOLEAN DEFAULT true,
    priority_support BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    total_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    affiliate_referrals INTEGER DEFAULT 0,
    affiliate_earnings INTEGER DEFAULT 0,
    daily_streak INTEGER DEFAULT 0,
    last_daily_claim DATE DEFAULT NULL,
    rank_position INTEGER DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invite_code_uses table to track usage
CREATE TABLE IF NOT EXISTS invite_code_uses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invite_code_id UUID REFERENCES invite_codes(id) ON DELETE CASCADE,
    used_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_code_uses ENABLE ROW LEVEL SECURITY;

-- Invite codes policies (readable by authenticated users)
CREATE POLICY "Invite codes are viewable by authenticated users" ON invite_codes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view all user stats" ON user_stats
    FOR SELECT USING (true);

CREATE POLICY "Users can update own stats" ON user_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Invite code uses policies
CREATE POLICY "Users can view invite code uses" ON invite_code_uses
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create functions
CREATE OR REPLACE FUNCTION use_invite_code(invite_code TEXT, user_id UUID)
RETURNS VOID AS $$
DECLARE
    code_record RECORD;
BEGIN
    -- Get the invite code record
    SELECT * INTO code_record
    FROM invite_codes
    WHERE code = invite_code
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid invite code';
    END IF;
    
    -- Check if code has uses remaining
    IF code_record.uses_remaining IS NOT NULL AND code_record.uses_remaining <= 0 THEN
        RAISE EXCEPTION 'Invite code has been exhausted';
    END IF;
    
    -- Record the usage
    INSERT INTO invite_code_uses (invite_code_id, used_by)
    VALUES (code_record.id, user_id);
    
    -- Decrement uses_remaining if not unlimited
    IF code_record.uses_remaining IS NOT NULL THEN
        UPDATE invite_codes
        SET uses_remaining = uses_remaining - 1,
            updated_at = NOW()
        WHERE id = code_record.id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_view_count(user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_stats (user_id, total_views)
    VALUES (user_id, 1)
    ON CONFLICT (user_id)
    DO UPDATE SET
        total_views = user_stats.total_views + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON user_stats
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_invite_codes_updated_at
    BEFORE UPDATE ON invite_codes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Insert default invite codes
INSERT INTO invite_codes (code, uses_remaining, membership_tier) VALUES
    ('NEPTUNE_TESTING_PURPOSES', NULL, 'elite'),
    ('ELITE2024', 100, 'elite'),
    ('FOUNDER', 10, 'founder'),
    ('VIP2024', 50, 'vip'),
    ('PREMIUM', 50, 'elite'),
    ('EXCLUSIVE', 25, 'elite')
ON CONFLICT (code) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_membership_tier ON profiles(membership_tier);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_views ON user_stats(total_views DESC);
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);