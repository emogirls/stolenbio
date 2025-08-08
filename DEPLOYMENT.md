# 🚀 Deployment Guide

Complete step-by-step guide to deploy your Biolink app to production safely and securely.

## 📋 Pre-Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Domain name ready (optional but recommended)
- [ ] Git repository set up

## 🔧 Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project
5. Choose a region close to your users
6. Set a strong database password

### 1.2 Configure Authentication

1. In your Supabase dashboard, go to **Authentication > Settings**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Set up custom SMTP (recommended for production)

### 1.3 Get API Credentials

1. Go to **Settings > API**
2. Copy your **Project URL**
3. Copy your **anon/public** key
4. Copy your **service_role** key (keep this secret!)

## 🏗️ Step 2: Project Setup

### 2.1 Clone and Install

```bash
# Clone your repository
git clone <your-repo-url>
cd biolink-app

# Install dependencies
npm install
```

### 2.2 Environment Configuration

```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.3 Test Locally

```bash
# Start development server
npm run dev

# Test in browser at http://localhost:3000
```

## 🌐 Step 3: Deploy Edge Function

### 3.1 Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Verify installation
supabase --version
```

### 3.2 Login and Link Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

**Note**: Find your project ref in Supabase dashboard URL: `https://app.supabase.com/project/YOUR-PROJECT-REF`

### 3.3 Deploy the Function

```bash
# Deploy the server function
supabase functions deploy server

# Verify deployment
supabase functions list
```

### 3.4 Set Environment Variables

In Supabase dashboard:
1. Go to **Edge Functions**
2. Click on **server** function
3. Go to **Settings** tab
4. Add environment variables:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

## 🚀 Step 4: Frontend Deployment

### Option A: Vercel (Recommended)

#### 4.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 4.2 Deploy to Vercel

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set project name
# - Choose deployment settings
```

#### 4.3 Set Environment Variables

1. Go to [vercel.com](https://vercel.com) dashboard
2. Select your project
3. Go to **Settings > Environment Variables**
4. Add:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your anon key

#### 4.4 Redeploy

```bash
# Trigger a new deployment with environment variables
vercel --prod
```

### Option B: Netlify

#### 4.1 Build and Deploy

```bash
# Build the project
npm run build

# Option 1: Drag and drop
# Go to netlify.com and drag the 'dist' folder

# Option 2: Git integration
# Connect your GitHub/GitLab repository
```

#### 4.2 Configure Environment Variables

1. Go to **Site settings > Environment variables**
2. Add your Supabase credentials
3. Trigger a redeploy

### Option C: Custom Server

#### 4.1 Build the Project

```bash
npm run build
```

#### 4.2 Serve Static Files

```bash
# Using a simple static server
npm install -g serve
serve dist -p 3000

# Or with nginx, Apache, etc.
```

## 🔧 Step 5: Post-Deployment Configuration

### 5.1 Update CORS Settings

Edit `supabase/functions/server/index.tsx`:

```typescript
const allowedOrigins = [
  'https://your-actual-domain.com',
  'https://www.your-actual-domain.com'
];
```

**Remove localhost origins in production!**

Redeploy the function:
```bash
supabase functions deploy server
```

### 5.2 Custom Domain (Optional)

#### For Vercel:
1. Go to **Settings > Domains**
2. Add your custom domain
3. Configure DNS records as instructed

#### For Netlify:
1. Go to **Site settings > Domain management**
2. Add custom domain
3. Configure DNS

### 5.3 SSL Certificate

- **Vercel/Netlify**: Automatic SSL with Let's Encrypt
- **Custom server**: Configure SSL manually

## 🛡️ Step 6: Security Hardening

### 6.1 Enable RLS (Row Level Security)

In Supabase dashboard:
1. Go to **Database > Tables**
2. For each table, enable RLS
3. Create appropriate policies

### 6.2 Review Security Headers

Check that your deployment includes:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- HTTPS enforcement

### 6.3 Monitor Rate Limits

Check the rate limiting settings in your edge function:
```typescript
app.use('/signup', rateLimit(5, 15 * 60 * 1000)); // Adjust as needed
```

## 📊 Step 7: Monitoring Setup

### 7.1 Health Check Endpoint

Test your health endpoint:
```bash
curl https://your-project.supabase.co/functions/v1/make-server-69c4ff4c/health
```

### 7.2 Set Up Monitoring

Consider adding:
- **Uptime monitoring**: Pingdom, UptimeRobot
- **Error tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible

### 7.3 Backup Strategy

1. In Supabase dashboard, go to **Database > Backups**
2. Enable Point-in-Time Recovery
3. Set up regular backup schedule

## 🎯 Step 8: Testing Production

### 8.1 Functionality Tests

- [ ] User registration works
- [ ] Login/logout works
- [ ] Profile creation and editing
- [ ] Public profile viewing
- [ ] Background media upload
- [ ] Social links functionality
- [ ] View count tracking

### 8.2 Performance Tests

- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness
- [ ] Image optimization
- [ ] API response times

### 8.3 Security Tests

- [ ] HTTPS enforced
- [ ] Rate limiting works
- [ ] Input validation
- [ ] XSS protection
- [ ] CORS properly configured

## 🔄 Step 9: Maintenance

### 9.1 Regular Updates

```bash
# Update dependencies monthly
npm update

# Security updates immediately
npm audit fix
```

### 9.2 Database Maintenance

- Monitor database performance
- Clean up old data if needed
- Review and optimize queries

### 9.3 Monitoring

- Check error logs weekly
- Monitor user growth
- Review security alerts

## 🚨 Troubleshooting

### Common Issues

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

## 🎉 Success!

Your Biolink app is now live! 🎊

Don't forget to:
- [ ] Share your new biolink platform
- [ ] Monitor the initial traffic
- [ ] Gather user feedback
- [ ] Plan future features

---

**Need help?** Create an issue or contact support!