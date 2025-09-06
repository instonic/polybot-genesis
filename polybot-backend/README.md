# 🤖 Polybot Genesis Backend

Backend API for the Polybot Genesis Multi-Agent AI Dispatch System.

## 🚀 Railway Deployment

### Quick Deploy to Railway:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/instonic/polybot-genesis&folder=polybot-backend)

### Manual Railway Setup:

1. **Create Railway Account**: [railway.app](https://railway.app)
2. **Connect GitHub**: Link your `instonic/polybot-genesis` repository
3. **Set Root Directory**: `/polybot-backend`
4. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=3000
   OPENAI_API_KEY=your_openai_key
   GOOGLE_API_KEY=your_google_key
   DEEPSEEK_API_KEY=your_deepseek_key
   ANTHROPIC_API_KEY=your_anthropic_key
   ```
5. **Deploy**: Railway will automatically build and deploy

## 🌐 Custom Domain Setup

After deployment, add custom domain in Railway:
- **Domain**: `api.polybot.online`
- **Type**: CNAME pointing to your Railway app

## 🔧 Environment Variables

Required for production:
```env
NODE_ENV=production
PORT=3000
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
DEEPSEEK_API_KEY=...
ANTHROPIC_API_KEY=...
```

## 📊 API Endpoints

- `GET /health` - Health check
- `POST /dispatch` - Multi-agent dispatch
- `POST /judge` - Judge evaluation
- `GET /audit/summary` - Audit logs

## 🛠️ Local Development

```bash
cd polybot-backend
npm install
cp .env.example .env
# Add your API keys to .env
npm start
```

## 🚀 Production Features

- ✅ **Multi-Agent Dispatch**: OpenAI, Google, DeepSeek
- ✅ **Judge System**: Anthropic Claude with fallback
- ✅ **Audit Logging**: Comprehensive request tracking
- ✅ **CORS**: Configured for polybot.online
- ✅ **Health Checks**: Built-in monitoring
- ✅ **Error Handling**: Graceful failure management
