# stolen.bio - Professional Biolink Platform

A comprehensive biolink platform with unlimited customization options, built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **150+ Design Styles** - Modern, creative, professional, and minimalist themes
- ⚡ **Lightning Performance** - Optimized for speed with instant loading
- 🔒 **Enterprise Security** - Bank-level security with 99.9% uptime guarantee
- 📊 **Advanced Analytics** - Track clicks, views, and engagement
- 🎵 **Media Support** - Background videos, images, and music
- 🌐 **Custom Domains** - Use your own domain name
- 📱 **Fully Responsive** - Perfect on all devices
- 🎭 **Avatar Decorations** - Custom badges and effects
- 🚀 **Real-time Updates** - Instant preview and changes

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Motion (Framer Motion)
- **Backend**: Supabase (Auth, Database, Storage)
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/stolen-bio.git
cd stolen-bio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your Supabase settings in `.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_DB_URL=postgresql://postgres:your_password@db.your-project-id.supabase.co:5432/postgres
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add the environment variables from your `.env` file
   - Redeploy if necessary

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The build files will be in the `dist` directory

## Project Structure

```
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── ui/              # shadcn/ui components
│   └── figma/           # Figma-related components
├── styles/              # Global styles and Tailwind config
├── utils/               # Utility functions
├── supabase/            # Supabase configuration
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `SUPABASE_DB_URL` | Supabase database connection string |

## Features Overview

### Free Plan ($0/month)
- 1 biolink
- Basic customization
- 5 social links
- stolen.bio subdomain
- Basic themes
- Community support

### Premium Plan ($9/month)
- Unlimited biolinks
- Advanced customization
- Unlimited social links
- Custom domain support
- Premium themes & effects
- Background media support
- Advanced analytics
- Custom badges
- Avatar decorations
- Priority support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@stolen.bio or join our Discord community.