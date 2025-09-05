#!/bin/bash

# 🚀 One-Click Deployment to polybot.online
# This script deploys Polybot Genesis to Railway (backend) and Vercel (frontend)

echo "🌐 Deploying Polybot Genesis to polybot.online..."
echo ""

# Check if required tools are installed
command -v railway >/dev/null 2>&1 || { 
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
}

command -v vercel >/dev/null 2>&1 || { 
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
}

# Ensure we're in the right directory
cd "$(dirname "$0")"
cd build

echo "🚂 Step 1: Deploying Backend to Railway..."
echo "📍 This will be: https://api.polybot.online"
cd polybot-backend

# Login to Railway (if not already logged in)
railway login

# Initialize Railway project
railway init

# Deploy backend
echo "🚀 Deploying backend..."
railway up

# Get the Railway URL
RAILWAY_URL=$(railway domain)
echo "✅ Backend deployed to: $RAILWAY_URL"
echo ""

# Go back to build directory
cd ..

echo "⚡ Step 2: Deploying Frontend to Vercel..."
echo "📍 This will be: https://polybot.online"

# Login to Vercel (if not already logged in)
vercel login

# Deploy frontend with custom domain
echo "🚀 Deploying frontend..."
vercel --prod

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "📋 Next Steps:"
echo "1. In Railway dashboard, add your API keys:"
echo "   - OPENAI_API_KEY"
echo "   - GOOGLE_API_KEY" 
echo "   - DEEPSEEK_API_KEY"
echo "   - ANTHROPIC_API_KEY"
echo ""
echo "2. In Vercel dashboard, set custom domain:"
echo "   - Add domain: polybot.online"
echo "   - Configure DNS as shown in Vercel"
echo ""
echo "3. Update DNS records:"
echo "   - polybot.online → Vercel (CNAME)"
echo "   - api.polybot.online → Railway (CNAME)"
echo ""
echo "🌟 Your Polybot Genesis will be live at:"
echo "   🌐 Frontend: https://polybot.online"
echo "   🔌 API: https://api.polybot.online"
echo ""
echo "🔧 Test your deployment:"
echo "   curl https://api.polybot.online/health"
echo ""
