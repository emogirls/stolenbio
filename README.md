# BioLink Service

A modern biolink platform that allows users to create personalized link hub pages with custom themes and colors.

## Features

- 🔐 User authentication (sign up/login)
- 🎨 Customizable themes (background, text, accent colors)
- 🔗 Link management (add/delete links)
- 📱 Responsive design
- 🌐 Public profile pages
- ⚡ Fast and lightweight

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, API)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd biolink-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Get your project URL and API keys
   - Update the environment variables (see below)

4. **Environment Variables**
   Copy `.env.example` to `.env.local` and update with your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your actual values:
   ```
   VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```
   
   **To get these values:**
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings → API
   - Copy the Project URL and anon/public key

5. **Start development server**
   ```bash
   npm run dev
   ```

### Deployment on Vercel

1. **Fork this repository** to your GitHub account

2. **Create a new Vercel project**
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Vercel will automatically detect it as a Vite project

3. **Set up Supabase**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Note down your project URL and API keys

4. **Configure Environment Variables in Vercel**
   - Go to your Vercel project settings
   - Add the following environment variables:
     ```
     SUPABASE_URL=your-supabase-project-url
     SUPABASE_ANON_KEY=your-supabase-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
     ```

5. **Deploy**
   - Vercel will automatically deploy your project
   - Your biolink service will be available at your Vercel domain

### Update Frontend Configuration

After deployment, update the Supabase configuration in your code:

1. Open `/utils/supabase/info.tsx`
2. Replace the placeholder values with your actual Supabase credentials:
   ```typescript
   export const projectId = 'your-actual-project-id'
   export const publicAnonKey = 'your-actual-anon-key'
   ```

## Usage

### For Users

1. **Sign Up**: Create an account with email and password
2. **Choose Username**: Pick a unique username for your biolink URL
3. **Customize Profile**: Set your display name, description, and theme colors
4. **Add Links**: Add links to your social media, website, etc.
5. **Share**: Share your biolink at `/profile/your-username`

### For Developers

The codebase is organized as follows:

- `/App.tsx` - Main application component with routing
- `/components/AuthForm.tsx` - Authentication interface
- `/components/Dashboard.tsx` - User dashboard for profile management
- `/components/PublicProfile.tsx` - Public biolink page display
- `/supabase/functions/server/` - Backend API endpoints

## API Endpoints

- `POST /signup` - Create new user account
- `GET /profile/:username` - Get public profile (no auth)
- `GET /my-profile` - Get current user's profile (auth required)
- `PUT /profile` - Update profile (auth required)
- `POST /links` - Add new link (auth required)
- `DELETE /links/:id` - Delete link (auth required)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details