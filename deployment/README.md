# 🚀 Deploy Polybot Genesis to polybot.online

## Quick Deployment (5 minutes)

### Option 1: One-Click Script
```bash
cd deployment
./deploy-to-production.sh
```

### Option 2: Manual Deployment

#### Backend to Railway:
```bash
cd deployment/build/polybot-backend
npm install -g @railway/cli
railway login
railway init
railway up
```

#### Frontend to Vercel:
```bash
cd deployment/build
npm install -g vercel
vercel login
vercel --prod
```

## 🔧 Configuration

### 1. Set API Keys in Railway Dashboard
```env
OPENAI_API_KEY=sk-your-key
GOOGLE_API_KEY=your-key
DEEPSEEK_API_KEY=your-key
ANTHROPIC_API_KEY=your-key
NODE_ENV=production
```

### 2. Configure Domain in Vercel
- Add custom domain: `polybot.online`
- Follow Vercel's DNS instructions

### 3. Set up DNS Records
```
polybot.online     CNAME  cname.vercel-dns.com
api.polybot.online CNAME  your-app-name.up.railway.app
```

## ✅ Verification

Test your deployment:
```bash
# Health check
curl https://api.polybot.online/health

# Multi-agent dispatch
curl -X POST https://api.polybot.online/dispatch \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello world","agents":["openai","google","deepseek"]}'
```

## 🌐 Live URLs
- **Frontend**: https://polybot.online
- **Backend API**: https://api.polybot.online
- **Health Check**: https://api.polybot.online/health
- **Audit Summary**: https://api.polybot.online/audit/summary

Your Polybot Genesis multi-agent system is now live! 🎉
