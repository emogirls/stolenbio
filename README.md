# stolen.bio

A modern, invite-only biolink platform built with React, TypeScript, and Supabase. Create stunning personal pages with custom themes, layouts, and social media integration.

## Features

- 🔐 **Invite-only registration** with secure authentication
- 🎨 **Customizable biolink pages** with multiple layouts and themes
- 🔗 **Social media integration** with popular platforms
- ⚡ **Real-time dashboard** for managing your biolink
- 🎯 **Advanced customization** including colors, effects, and animations
- 📱 **Fully responsive** design for all devices
- 🚀 **Fast and secure** powered by Supabase

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Radix UI components
- **Backend**: Supabase Authentication
- **Storage**: Browser localStorage (for biolink configs)
- **Deployment**: Vercel
- **Animations**: Framer Motion

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd biolink-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update Supabase configuration**
   Edit `/utils/supabase/client.tsx` with your Supabase project credentials

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Authentication

The platform uses invite-only registration with Supabase authentication. Valid invite codes:
- `WELCOME1`, `BETA2024`, `EARLY001`, `TESTCODE`, `DEMO123`
- `STOLEN1`, `BIO2024`, `ALPHA001`

## Project Structure

```
├── src/
│   └── main.tsx          # Application entry point
├── components/
│   ├── Dashboard.tsx     # Main dashboard component
│   └── ui/              # Reusable UI components
├── utils/
│   └── supabase/        # Supabase configuration
├── styles/
│   └── globals.css      # Global styles and Tailwind config
└── App.tsx             # Root application component
```

## Configuration Storage

Biolink configurations are stored locally in the browser's localStorage, providing:
- Instant saving and loading
- No database setup required
- Offline functionality
- Simple deployment

Configuration is saved per user ID and includes:
- Basic biolink settings (title, description, layout)
- Social media links
- Visual effects and customizations
- Premium features

## Deployment

### Deploy to Vercel

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard (if using environment variables)
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

```bash
npm run build
```

The `dist` folder contains the production build ready for deployment.

## Supabase Setup

1. Create a new Supabase project
2. Enable authentication in the Supabase dashboard
3. Update the credentials in `/utils/supabase/client.tsx`
4. Configure authentication providers as needed

## Features Overview

### Dashboard
- Tabbed interface for configuration (Bio-Link, Bio-Socials, Misc, Premium)
- Real-time preview of changes
- Social media links management
- Color and theme customization
- Advanced effects and animations

### Authentication
- Secure user registration with invite codes
- Session management with Supabase
- Automatic login state persistence

### Biolink Pages
- Multiple layout options
- Custom colors and effects
- Social media integration
- Responsive design
- Local storage persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository.