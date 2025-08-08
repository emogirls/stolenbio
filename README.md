# Biolink App 🔗

A modern, secure biolink application with stunning 3D effects and custom backgrounds. Create personalized pages to showcase all your social media links and digital presence in one beautiful, shareable link.

## ✨ Features

- **Beautiful 3D Design**: Floating cards with stunning 3D effects
- **Custom Backgrounds**: Support for GIFs, videos, and images
- **Real-time Customization**: Live preview while editing
- **Secure Authentication**: Built with Supabase Auth
- **Rate Limiting**: Built-in protection against abuse
- **Mobile Responsive**: Optimized for all devices
- **Admin Panel**: Badge management system
- **View Analytics**: Track profile views
- **SEO Optimized**: Meta tags and social sharing

## 🛡️ Security Features

- Input validation and sanitization
- Rate limiting on all endpoints
- CORS protection
- XSS protection
- SQL injection prevention
- Secure file upload handling
- Environment variable protection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd biolink-app
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your Project URL and anon/public key
4. Enable Email authentication in Authentication > Providers

### 4. Deploy the Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the server function
supabase functions deploy server
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 📦 Production Deployment

### Option 1: Vercel (Recommended)

1. **Prepare for deployment:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   ```

3. **Set environment variables in Vercel:**
   - Go to your Vercel project dashboard
   - Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Update CORS settings:**
   - Edit `/supabase/functions/server/index.tsx`
   - Replace `'https://yourdomain.com'` with your Vercel URL
   - Redeploy the function: `supabase functions deploy server`

### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your Git repository

3. **Set environment variables:**
   - Site settings > Environment variables
   - Add your Supabase credentials

### Option 3: Custom Server

For a custom server deployment:

```bash
# Build the project
npm run build

# Serve with a static file server
npx serve dist -p 3000
```

## 🔧 Configuration

### Domain Setup

1. **Custom Domain:**
   - Add your domain to Vercel/Netlify
   - Update CORS settings in the server function
   - Update meta tags in `index.html`

2. **SSL Certificate:**
   - Automatically handled by Vercel/Netlify
   - For custom servers, use Let's Encrypt

### Security Hardening

1. **Rate Limiting:**
   ```typescript
   // Adjust in /supabase/functions/server/index.tsx
   app.use('/signup', rateLimit(5, 15 * 60 * 1000)); // 5 per 15 min
   ```

2. **CORS Configuration:**
   ```typescript
   const allowedOrigins = [
     'https://yourdomain.com',
     'https://www.yourdomain.com'
   ];
   ```

3. **Content Security Policy:**
   - Update CSP headers in `index.html`
   - Adjust for your specific needs

### Database Backup

Set up automated backups in Supabase:
1. Go to Database > Backups
2. Enable Point-in-Time Recovery
3. Configure retention period

## 🎨 Customization

### Styling

- Edit `/styles/globals.css` for global styles
- Customize color scheme using CSS variables
- Modify Tailwind configuration in `tailwind.config.ts`

### Features

- Add new social platforms in `BiolinkPage.tsx`
- Customize 3D effects and animations
- Add new profile fields
- Implement file upload for backgrounds

## 📊 Analytics

### View Tracking

The app includes basic view tracking:
- IP-based throttling (1 view per hour per IP)
- Real-time view count updates
- Admin analytics (coming soon)

### Enhanced Analytics

For advanced analytics, consider integrating:
- Google Analytics 4
- Plausible Analytics
- Custom event tracking

## 🔐 Admin Features

### Badge Management

1. **Set up admins:**
   ```bash
   # In Supabase SQL Editor
   INSERT INTO kv_store_69c4ff4c (key, value) 
   VALUES ('admins', '["user-id-1", "user-id-2"]');
   ```

2. **Assign badges:**
   - Use the admin API endpoint
   - Or create an admin dashboard

### Content Moderation

Implement content moderation:
- Automated profanity filtering
- Image content scanning
- User reporting system

## 🚨 Monitoring

### Health Checks

- Endpoint: `/functions/v1/make-server-69c4ff4c/health`
- Monitor server status
- Set up alerts for downtime

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Custom logging system

## 🚨 Troubleshooting

### Common Issues

#### "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"
This error occurs when environment variables are not properly configured:

1. **Check if .env.local exists:**
   ```bash
   ls -la .env.local
   ```

2. **Verify the file has the correct variables:**
   ```bash
   cat .env.local
   ```
   
3. **Update with your Supabase credentials:**
   - Replace `your-project-id` with your actual project ID
   - Replace `your-anon-key-here` with your actual anon key
   
4. **Restart the development server:**
   ```bash
   npm run dev
   ```

#### "Environment variables not found"
- Check `.env.local` file exists
- Verify variable names match exactly
- Restart development server

#### "CORS error"
- Update allowed origins in edge function
- Ensure production domain is included
- Redeploy the function

#### "Function deployment failed"
- Check Supabase CLI is logged in
- Verify project is linked correctly
- Check function code for errors

#### "Build fails"
- Run `npm run type-check`
- Fix TypeScript errors
- Check for missing dependencies

### Getting Help

- Check the [Issues](link-to-issues) page
- Join our [Discord](link-to-discord)
- Email support: support@yourdomain.com

## 🛠️ Development

### Project Structure

```
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── AuthForm.tsx    # Authentication
│   ├── Dashboard.tsx   # User dashboard
│   └── BiolinkPage.tsx # Public biolink view
├── supabase/functions/ # Edge functions
├── utils/              # Utilities and API
├── styles/             # Global styles
└── App.tsx            # Main application
```

### Adding Features

1. **New Profile Fields:**
   - Update `Profile` interface in `utils/api.tsx`
   - Add validation in server function
   - Update UI components

2. **New Social Platforms:**
   - Add to `getSocialIcon` function
   - Update platform validation
   - Add custom icons

### Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

- Create an issue for bugs
- Join our Discord for community support
- Email: support@yourdomain.com

## 🎯 Roadmap

- [ ] File upload for backgrounds
- [ ] Advanced analytics dashboard
- [ ] QR code generation
- [ ] Custom themes
- [ ] Mobile app
- [ ] White-label solutions

---

Made with ❤️ by [Your Name]