# stolen.bio - Elite Invite-Only Biolink Platform

A mysterious, exclusive biolink platform with invite-only access, gamification elements, and premium features.

## 🔐 Features

- **Invite-Only Access**: Exclusive membership with valid invite codes
- **Elite Dashboard**: Comprehensive biolink customization
- **Gamification**: Steal Coins, leaderboards, and achievements
- **Premium Effects**: Advanced visual effects and customization
- **Social Integration**: Drag-and-drop social media management
- **Real-time Updates**: Live data with Supabase backend

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### 1. Clone and Install

```bash
git clone <repository-url>
cd stolen-bio
npm install
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API
3. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run the SQL from `/supabase/migrations/001_initial_schema.sql`

This will create all necessary tables and insert default invite codes including:
- `NEPTUNE_TESTING_PURPOSES` (unlimited uses)
- `ELITE2024` (100 uses)
- `FOUNDER` (10 uses) 
- `VIP2024` (50 uses)

### 4. Run the Development Server

```bash
npm run dev
```

## 🎫 Testing Access

Use the invite code `NEPTUNE_TESTING_PURPOSES` to create a test account.

## 🏗️ Database Schema

The platform uses the following main tables:

- **invite_codes**: Manages invitation codes and usage limits
- **profiles**: User biolink profiles and customization settings
- **user_stats**: User statistics and gamification data
- **invite_code_uses**: Tracks invite code usage

## 🛠️ Key Components

- **MainPage**: Mysterious landing page with invite code validation
- **AuthForm**: Supabase-powered authentication with invite verification  
- **Dashboard**: Comprehensive biolink customization interface
- **BiolinkPage**: Public biolink display with effects and customization

## 🎨 Design Philosophy

- **Minimal & Mysterious**: Clean, cryptic interface design
- **Elite Aesthetic**: Premium feel with technical/restricted theming
- **Professional UX**: Subtle animations and interactions
- **Dark Theme**: Midnight blue color scheme with emerald accents

## 🔧 Configuration

The platform supports extensive customization:

- **Visual Effects**: Particles, glows, animations, mouse trails
- **Layout Options**: Multiple biolink layouts and arrangements  
- **Color Themes**: Full color customization with live preview
- **Media Uploads**: Avatar, background, music, and banner support
- **Social Links**: Drag-and-drop social media management
- **Premium Features**: Elite badges, decorations, and effects

## 📊 Gamification

- **Steal Coins**: Virtual currency system
- **Leaderboards**: Global rankings by various metrics
- **Achievements**: Milestone-based badge system
- **Daily Rewards**: Login streaks and daily coin bonuses
- **Affiliate System**: Referral tracking and rewards

## 🚦 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider
3. Ensure your Supabase project is properly configured with RLS policies

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Invite code validation prevents unauthorized access
- User data isolation and proper authentication flows
- Secure profile and settings management

## 🎯 Elite Experience

stolen.bio is designed as an exclusive platform where access is earned through invitation. Every aspect of the user experience reinforces this exclusivity while providing powerful biolink customization tools.

---

**Access is restricted. Invitation required.**