# 🤖 Polybot Genesis - Multi-Agent AI Dispatch System

![Polybot Genesis](https://img.shields.io/badge/Polybot-Genesis-blue?style=for-the-badge)
![Live Demo](https://img.shields.io/badge/Live%20Demo-polybot.online-green?style=for-the-badge)

## 🌟 Overview

**Polybot Genesis** is an advanced multi-agent AI dispatch system that orchestrates multiple AI providers (OpenAI, Google Gemini, DeepSeek) with intelligent judge evaluation and comprehensive audit logging.

### ✨ **Live Demo**: [https://polybot.online](https://polybot.online)

## 🚀 Features

### 🤖 **Multi-Agent AI Dispatch**
- **OpenAI GPT-4** integration
- **Google Gemini** integration  
- **DeepSeek** integration
- **Anthropic Claude** judge system

### 🏛️ **Intelligent Judge System**
- **Automatic evaluation** of AI responses
- **Fallback logic**: Anthropic → OpenAI
- **Response validation** and scoring
- **Winner selection** based on quality metrics

### 📊 **Comprehensive Audit Logging**
- **Real-time tracking** of all dispatches
- **Performance metrics** and response times
- **Judge evaluation logs**
- **Failure tracking** and analytics

### 🎛️ **Advanced Controls**
- **Token control**: Brief (300), Full (800), Deep Think (1500)
- **Response mode selection**
- **Agent selection** (individual or all)
- **Real-time status updates**

## 🏗️ Architecture

```
Frontend (Static)     Backend (Node.js)     AI Providers
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│                 │   │                 │   │   OpenAI GPT-4  │
│  Polybot UI     │◄──┤  Express API    │◄──┤   Google Gemini │
│  polybot.online │   │  Multi-Agent    │   │   DeepSeek      │
│                 │   │  Dispatch       │   │   Anthropic     │
└─────────────────┘   └─────────────────┘   └─────────────────┘
                              │
                      ┌─────────────────┐
                      │                 │
                      │  Audit Logger   │
                      │  JSON Storage   │
                      │                 │
                      └─────────────────┘
```

## 🛠️ Technology Stack

### **Frontend**
- **HTML5** with modern CSS
- **Vanilla JavaScript** for maximum performance
- **Responsive design** for all devices
- **Real-time UI updates**

### **Backend**
- **Node.js** + Express
- **Axios** for HTTP requests
- **CORS** enabled for cross-origin requests
- **Environment-based configuration**

### **Deployment**
- **Frontend**: Vercel (CDN + Edge functions)
- **Backend**: Railway (Containerized deployment)
- **DNS**: Cloudflare (SSL + Performance)
- **Domain**: polybot.online

## 🚀 Quick Start

### **Development Setup**

```bash
# Clone repository
git clone https://github.com/instonic/polybot-genesis.git
cd polybot-genesis

# Backend setup
cd polybot-backend
npm install
cp .env.example .env
# Add your API keys to .env
npm start

# Frontend (serve static files)
# Open public/index.html in browser
# Or use any static file server
```

### **Environment Variables**

```env
# AI Provider API Keys
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key  
DEEPSEEK_API_KEY=your_deepseek_key
ANTHROPIC_API_KEY=your_anthropic_key

# Server Configuration
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
```

## 🌐 Deployment

### **Production Deployment**

```bash
# Deploy to polybot.online
cd deployment
./deploy-to-production.sh
```

### **Manual Deployment**

**Backend (Railway):**
```bash
cd polybot-backend
railway deploy
```

**Frontend (Vercel):**
```bash
vercel --prod --domain polybot.online
```

## 📊 API Endpoints

### **Multi-Agent Dispatch**
```http
POST /dispatch
Content-Type: application/json

{
  "prompt": "Explain quantum computing",
  "agents": ["openai", "google", "deepseek"],
  "responseMode": "brief",
  "judgeMode": "auto"
}
```

### **Judge Evaluation**
```http
POST /judge
Content-Type: application/json

{
  "prompt": "Original prompt",
  "responses": { /* agent responses */ },
  "judge": "anthropic"
}
```

### **Health Check**
```http
GET /health
```

### **Audit Summary**
```http
GET /audit/summary
```

## 🎯 Usage Examples

### **Basic Multi-Agent Query**
```javascript
const response = await fetch('https://api.polybot.online/dispatch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "What are the benefits of renewable energy?",
    agents: ["openai", "google", "deepseek"],
    responseMode: "full",
    judgeMode: "auto"
  })
});
```

### **Custom Judge Evaluation**
```javascript
const judgeResult = await fetch('https://api.polybot.online/judge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "Original question",
    responses: { /* AI responses */ },
    judge: "anthropic"
  })
});
```

## 🔧 Configuration

### **Response Modes**
- **Brief** (300 tokens): Quick, concise answers
- **Full** (800 tokens): Detailed explanations  
- **Deep Think** (1500 tokens): Comprehensive analysis

### **Judge Modes**
- **Auto**: Automatic judge selection with fallback
- **Manual**: Choose specific judge (anthropic/openai)
- **None**: Skip judge evaluation

## 📈 Monitoring & Analytics

### **Audit Dashboard**
- **Total dispatches**: Real-time counters
- **Agent performance**: Success/failure rates
- **Response times**: Performance metrics
- **Judge effectiveness**: Evaluation quality

### **Health Monitoring**
- **API health checks**: `/health` endpoint
- **Service status**: All components monitored
- **Error tracking**: Comprehensive logging

## 🛡️ Security Features

- **API key protection**: Environment-based secrets
- **CORS configuration**: Controlled access
- **Rate limiting**: Prevent abuse
- **Input validation**: Secure request handling

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Google** for Gemini API
- **DeepSeek** for AI services
- **Anthropic** for Claude API
- **Vercel** for frontend hosting
- **Railway** for backend deployment
- **Cloudflare** for DNS and security

## 📞 Support

- **Live Demo**: [https://polybot.online](https://polybot.online)
- **API Documentation**: [https://api.polybot.online/docs](https://api.polybot.online/docs)
- **Issues**: [GitHub Issues](https://github.com/instonic/polybot-genesis/issues)

---

**Built with ❤️ by the Polybot Genesis Team**

*Revolutionizing AI interactions through intelligent multi-agent dispatch*
