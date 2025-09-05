# Polybot.online Domain Configuration

## Domain Architecture
- **Frontend**: `https://polybot.online` (main application)
- **Backend API**: `https://api.polybot.online` (backend services)

## DNS Configuration Required

### A Records (if using IP)
```
polybot.online     A     YOUR_SERVER_IP
api.polybot.online A     YOUR_SERVER_IP
```

### CNAME Records (if using proxy/CDN)
```
polybot.online     CNAME your-hosting-provider.com
api.polybot.online CNAME your-hosting-provider.com
```

## SSL Certificate Setup
- Ensure SSL certificates for both domains:
  - `polybot.online`
  - `api.polybot.online`
  - Or use wildcard: `*.polybot.online`

## Deployment Options

### Option 1: Traditional VPS/Server
1. Deploy backend to server on port 3000
2. Use Nginx/Apache as reverse proxy
3. Configure SSL with Let's Encrypt
4. Set up static file serving for frontend

### Option 2: Cloud Platform (Recommended)
- **Vercel/Netlify**: Frontend (`polybot.online`)
- **Railway/Render/Heroku**: Backend (`api.polybot.online`)
- **Alternative**: Both on same platform with subdomain routing

### Option 3: Docker + Cloud
- Container with both frontend and backend
- Deploy to Google Cloud Run, AWS ECS, or DigitalOcean Apps
- Configure domain routing

## Environment Variables for Production
```env
# Backend (.env)
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
CORS_ORIGIN=https://polybot.online

# Frontend (if using React build)
REACT_APP_API_DOMAIN=https://api.polybot.online
```

## Current Code Changes Made
✅ Frontend automatically detects `polybot.online` hostname
✅ Routes API calls to `https://api.polybot.online`
✅ Maintains fallback to Codespaces and localhost for development
✅ Ready for production deployment
