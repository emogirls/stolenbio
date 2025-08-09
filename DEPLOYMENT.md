# Deployment Guide

## Environment Variables Configuration

This project requires specific environment variable naming for different platforms:

### Local Development (.env.local)
For local development, use the standard format:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Vercel Deployment
For Vercel deployment, environment variable names cannot contain dashes. Set these in your Vercel project settings:

**Environment Variable Names (use lowercase with underscores):**
- `vite_supabase_url`
- `vite_supabase_anon_key` 
- `supabase_url`
- `supabase_anon_key`
- `supabase_service_role_key`

**Values (your actual Supabase credentials):**
- Get these from your Supabase project dashboard at https://supabase.com
- Project URL: Found in Settings → API → Project URL
- Anon Key: Found in Settings → API → Project API keys → anon/public
- Service Role Key: Found in Settings → API → Project API keys → service_role

## Deployment Steps

1. **Create Vercel Project**
   - Connect your GitHub repository to Vercel
   - Vercel auto-detects this as a Vite project

2. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all the variables listed above
   - Make sure to use underscores, not dashes in variable names

3. **Deploy**
   - Vercel will automatically build and deploy
   - The vercel.json configuration handles routing for the SPA

## Troubleshooting

### Environment Variable Issues
- **Problem**: "provider is not enabled" errors
- **Solution**: Make sure all environment variables are set correctly in Vercel

### Build Issues  
- **Problem**: Build fails on Vercel
- **Solution**: Check that all dependencies are listed in package.json

### Routing Issues
- **Problem**: Direct URLs don't work (404 errors)
- **Solution**: The vercel.json file handles SPA routing - make sure it's not modified

## Important Notes

- The project uses Supabase Edge Functions for the backend
- All API routes are prefixed with `/make-server-26e0ccc2`
- The frontend and backend use different Supabase clients with different keys
- Never expose the service role key to the frontend