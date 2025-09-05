# 🌐 Quick DNS Setup Guide for polybot.online

## The 3-Step Process

### 🛒 Step 1: Buy the Domain (2 minutes)
Go to any domain registrar and purchase `polybot.online`:
- **Namecheap** (recommended): namecheap.com
- **Cloudflare**: cloudflare.com/products/registrar
- **Porkbun**: porkbun.com
- **Google Domains**: domains.google.com

### ⚙️ Step 2: Choose Your DNS Setup

#### Option A: Cloudflare DNS (Recommended)
**Why**: Free SSL, CDN, DDoS protection, fast global DNS

1. **Add domain to Cloudflare**:
   - Go to cloudflare.com → "Add a Site"
   - Enter: `polybot.online`
   - Select "Free" plan

2. **Get nameservers** (example):
   ```
   alice.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```

3. **Update nameservers** at your domain registrar:
   - Log into Namecheap/GoDaddy/etc.
   - Find "Nameservers" or "DNS" settings
   - Change from "Default" to "Custom"
   - Enter the Cloudflare nameservers

4. **Add DNS records** in Cloudflare:
   ```
   Type: CNAME | Name: @ | Target: cname.vercel-dns.com | Proxy: ON
   Type: CNAME | Name: www | Target: cname.vercel-dns.com | Proxy: ON
   Type: CNAME | Name: api | Target: your-railway-app.up.railway.app | Proxy: ON
   ```

#### Option B: Vercel DNS (Simplest)
**Why**: Integrated with Vercel hosting, automatic setup

1. **In Vercel dashboard**:
   - Go to "Domains" → "Add Domain"
   - Enter: `polybot.online`
   - Get nameservers from Vercel

2. **Update nameservers** at your registrar:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

3. **Add API subdomain** manually:
   ```
   Type: CNAME | Name: api | Target: your-railway-app.up.railway.app
   ```

### 🚀 Step 3: Deploy & Configure

1. **Deploy your app**:
   ```bash
   cd deployment
   ./deploy-to-production.sh
   ```

2. **Add domains to hosting**:
   - **Vercel**: Add `polybot.online` and `www.polybot.online`
   - **Railway**: Add `api.polybot.online`

3. **Wait for DNS propagation**: 15 minutes - 6 hours

4. **Test your setup**:
   ```bash
   ./check-dns.sh
   ```

## 📋 Complete Example Walkthrough

**Scenario**: Using Cloudflare DNS + Vercel Frontend + Railway Backend

### 1. Domain Purchase (Namecheap)
- Buy `polybot.online` at namecheap.com
- Total cost: ~$12/year

### 2. Cloudflare Setup
- Add `polybot.online` to Cloudflare (free account)
- Get nameservers: `alice.ns.cloudflare.com`, `bob.ns.cloudflare.com`
- Update nameservers in Namecheap dashboard

### 3. DNS Records in Cloudflare
```
CNAME | @ | cname.vercel-dns.com | Proxied ✅
CNAME | www | cname.vercel-dns.com | Proxied ✅  
CNAME | api | polybot-backend-production.up.railway.app | Proxied ✅
```

### 4. Hosting Configuration
- **Vercel**: Add custom domain `polybot.online`
- **Railway**: Add custom domain `api.polybot.online`

### 5. Result
- ✅ `https://polybot.online` → Your frontend
- ✅ `https://api.polybot.online` → Your backend
- ✅ Automatic SSL certificates
- ✅ Global CDN acceleration

## ⏱️ Timeline

| Step | Time Required | When Complete |
|------|---------------|---------------|
| Domain purchase | 2 minutes | Immediately |
| Nameserver update | 5 minutes | 2-6 hours |
| DNS propagation | Wait | 15 min - 6 hours |
| SSL provisioning | Automatic | 5-15 minutes |
| **Total** | **~7 minutes work** | **2-6 hours wait** |

## 🛠️ Troubleshooting

### "Domain not found"
- **Cause**: DNS not propagated yet
- **Fix**: Wait 2-6 hours, check with `./check-dns.sh`

### "SSL certificate error"  
- **Cause**: SSL not provisioned yet
- **Fix**: Wait 15 minutes after DNS resolves

### "CORS error" or "API not working"
- **Cause**: API subdomain not configured
- **Fix**: Add `api.polybot.online` CNAME record

### "502 Bad Gateway"
- **Cause**: Backend not responding
- **Fix**: Check Railway deployment and environment variables

## 🎯 Success Checklist

- [ ] Domain purchased: `polybot.online`
- [ ] Nameservers updated at registrar  
- [ ] DNS records added (@ and api subdomains)
- [ ] Vercel domain configured: `polybot.online`
- [ ] Railway domain configured: `api.polybot.online`
- [ ] DNS resolution confirmed: `nslookup polybot.online`
- [ ] SSL certificates active: `https://` works
- [ ] API health check: `curl https://api.polybot.online/health`
- [ ] Frontend loads: Visit `https://polybot.online`

**When all checkboxes are ✅, your Polybot Genesis is live on your custom domain!** 🎉
