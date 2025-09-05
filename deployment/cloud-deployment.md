# Polybot.online - Cloud Deployment Guide

## Option 1: Railway (Recommended - Fastest Setup)

### Backend Deployment to Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd deployment/build/polybot-backend
railway deploy

# Set environment variables in Railway dashboard:
# - NODE_ENV=production
# - HOST=0.0.0.0
# - PORT=3000
# - Add your API keys

# Get your Railway backend URL (e.g., https://polybot-backend-production.up.railway.app)
```

### Frontend Deployment to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd deployment/build/frontend
vercel --prod

# Set custom domain in Vercel dashboard: polybot.online
```

### DNS Configuration:
```
polybot.online     CNAME  cname.vercel-dns.com
api.polybot.online CNAME  <your-railway-domain>
```

---

## Option 2: DigitalOcean App Platform

### Deploy via GitHub:
1. Push code to GitHub repository
2. Connect to DigitalOcean App Platform
3. Configure as multi-component app:
   - **Backend**: Node.js service from `/polybot-backend`
   - **Frontend**: Static site from `/public`

### Environment Variables:
```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
OPENAI_API_KEY=your_key
GOOGLE_API_KEY=your_key
DEEPSEEK_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
```

---

## Option 3: Heroku (Traditional)

### Backend:
```bash
# Create Heroku app
heroku create polybot-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set HOST=0.0.0.0
heroku config:set PORT=3000

# Deploy
git subtree push --prefix=polybot-backend heroku main
```

### Frontend:
```bash
# Deploy to Netlify or Vercel
# Point custom domain polybot.online to frontend
# Point api.polybot.online to Heroku backend
```

---

## Option 4: AWS (Scalable)

### Backend - AWS Lambda + API Gateway:
```bash
# Install Serverless Framework
npm install -g serverless

# Deploy backend as serverless functions
cd deployment/build/polybot-backend
serverless deploy
```

### Frontend - AWS S3 + CloudFront:
```bash
# Deploy static frontend to S3
aws s3 sync frontend/ s3://polybot-frontend --delete
```

---

## Current Code Status ✅

Your code is already configured for `polybot.online`:

1. **Frontend detection**: Automatically detects `polybot.online` hostname
2. **API routing**: Routes to `https://api.polybot.online`
3. **CORS configured**: Allows `polybot.online` and `www.polybot.online`
4. **Environment variables**: Ready for production deployment
5. **SSL ready**: HTTPS configuration prepared

## Quick Start Recommendation:

**For fastest deployment** (5 minutes):
1. Use **Railway** for backend (api.polybot.online)
2. Use **Vercel** for frontend (polybot.online)
3. Both support custom domains with automatic SSL

Commands:
```bash
# Backend to Railway
cd deployment/build/polybot-backend
railway deploy

# Frontend to Vercel  
cd deployment/build/frontend
vercel --prod --domain polybot.online
```

Your Polybot Genesis will be live at `https://polybot.online` with full multi-agent dispatch functionality! 🚀
