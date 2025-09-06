# 🚀 Railway Deployment Guide - Polybot Genesis Backend

## 📋 **Environment Variables Required**

Add these in your Railway dashboard under **Variables**:

```bash
# Production Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# AI Provider API Keys (Required for live functionality)
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Test Mode (if you don't have API keys yet)
TEST_MODE=true
```

## 🛠️ **Railway Configuration**

Your Railway project should detect:
- **Framework**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: Automatically configured via `$PORT`

## 🌐 **Custom Domain Setup**

1. **In Railway Dashboard**:
   - Go to **Settings** → **Domains**
   - Add custom domain: `api.polybot.online`
   - Copy the CNAME target provided

2. **In Cloudflare Dashboard**:
   - Add CNAME record:
     - **Type**: CNAME
     - **Name**: api
     - **Target**: [Railway domain]
     - **Proxy**: ✅ Proxied

## 🔍 **Health Check Endpoints**

After deployment, test these endpoints:

```bash
# Health check
curl https://api.polybot.online/health

# API info
curl https://api.polybot.online/

# Test dispatch (with API keys)
curl -X POST https://api.polybot.online/dispatch \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello from Railway!",
    "agents": ["openai"],
    "responseMode": "brief",
    "judgeMode": "auto"
  }'
```

## ⚡ **Expected Responses**

### Health Check:
```json
{
  "status": "healthy",
  "timestamp": "2025-09-06T...",
  "uptime": "...",
  "version": "1.0.0"
}
```

### API Root:
```json
{
  "name": "Polybot Genesis API",
  "version": "1.0.0",
  "status": "operational",
  "endpoints": {
    "dispatch": "/dispatch",
    "judge": "/judge",
    "health": "/health",
    "audit": "/audit/summary"
  }
}
```

## 🔧 **Troubleshooting**

### If deployment fails:
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Ensure GitHub repository is accessible
4. Check that port configuration is correct

### If API calls fail:
1. Verify API keys are correctly set in Railway
2. Check CORS configuration for your domain
3. Test with curl to isolate frontend vs backend issues

## 📊 **Production Monitoring**

Monitor these metrics in Railway:
- **CPU Usage**: Should be low for typical loads
- **Memory Usage**: ~100-200MB typical
- **Response Times**: Health check should be <100ms
- **Error Rates**: Should be near 0%

## 🎯 **Next Steps After Deployment**

1. ✅ Test all endpoints
2. ✅ Add custom domain `api.polybot.online`
3. ✅ Update Cloudflare DNS
4. ✅ Test frontend integration
5. ✅ Monitor logs and performance

---

**Your Polybot Genesis backend will be live at `https://api.polybot.online` serving your multi-agent AI dispatch system!** 🤖
