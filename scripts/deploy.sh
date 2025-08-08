#!/bin/bash

# Biolink App Deployment Script
# This script helps deploy the application safely to production

set -e

echo "🚀 Starting Biolink App Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check for required environment variables
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "❌ Error: No environment file found. Please create .env.local with your Supabase credentials."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build the project
echo "🏗️  Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Vercel (if vercel CLI is available)
if command -v vercel &> /dev/null; then
    echo "🔄 Deploying to Vercel..."
    vercel --prod
    echo "✅ Deployment to Vercel completed!"
else
    echo "ℹ️  Vercel CLI not found. You can:"
    echo "   1. Install it: npm install -g vercel"
    echo "   2. Deploy manually by uploading the 'dist' folder"
    echo "   3. Or connect your Git repository to Vercel"
fi

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your domain in the CORS settings"
echo "   2. Deploy the Supabase Edge Function"
echo "   3. Test the live application"
echo "   4. Monitor for any issues"
echo ""
echo "🔗 Don't forget to update the CORS settings in your Supabase function!"
echo "   File: supabase/functions/server/index.tsx"
echo "   Replace 'yourdomain.com' with your actual domain"