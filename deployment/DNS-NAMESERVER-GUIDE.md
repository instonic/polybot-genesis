# 🌐 DNS & Nameserver Configuration for polybot.online

## Overview
To make `polybot.online` work with your Polybot Genesis deployment, you need to:
1. **Purchase the domain** `polybot.online`
2. **Configure nameservers** (point to your DNS provider)
3. **Set up DNS records** (point to your hosting services)

---

## Step 1: Domain Registration

### Purchase polybot.online from:
- **Namecheap** (recommended)
- **GoDaddy** 
- **Google Domains**
- **Cloudflare Registrar**
- **Porkbun**

---

## Step 2: Choose DNS Provider & Set Nameservers

### Option A: Cloudflare (Recommended - Free SSL + CDN)

**Benefits**: Free SSL, CDN, DDoS protection, analytics

1. **Add domain to Cloudflare**:
   - Go to cloudflare.com → Add Site
   - Enter: `polybot.online`
   - Choose Free plan

2. **Update nameservers at domain registrar**:
   ```
   Nameserver 1: alice.ns.cloudflare.com
   Nameserver 2: bob.ns.cloudflare.com
   ```
   *(Cloudflare will give you specific nameservers)*

3. **DNS Records in Cloudflare**:
   ```
   Type: CNAME | Name: @ | Value: cname.vercel-dns.com | Proxy: ON
   Type: CNAME | Name: www | Value: cname.vercel-dns.com | Proxy: ON
   Type: CNAME | Name: api | Value: your-app.up.railway.app | Proxy: ON
   ```

### Option B: Vercel DNS (Simple)

**Benefits**: Integrated with Vercel hosting

1. **In Vercel Dashboard**:
   - Go to Domains → Add Domain
   - Enter: `polybot.online`
   - Vercel will provide nameservers

2. **Update nameservers at domain registrar**:
   ```
   Nameserver 1: ns1.vercel-dns.com
   Nameserver 2: ns2.vercel-dns.com
   ```

3. **DNS Records** (Vercel manages automatically):
   ```
   polybot.online → Vercel frontend
   api.polybot.online → Railway backend (add manually)
   ```

### Option C: Domain Registrar DNS

**Use your registrar's DNS** (Namecheap, GoDaddy, etc.)

**DNS Records**:
```
Type: CNAME | Host: @ | Value: cname.vercel-dns.com
Type: CNAME | Host: www | Value: cname.vercel-dns.com  
Type: CNAME | Host: api | Value: your-app.up.railway.app
```

---

## Step 3: SSL Certificate Configuration

### Automatic SSL (Recommended):
- **Cloudflare**: Automatic SSL + Edge certificates
- **Vercel**: Automatic Let's Encrypt certificates
- **Railway**: Automatic SSL for custom domains

### Manual SSL:
- Use Let's Encrypt with certbot
- Upload certificates to your hosting provider

---

## Step 4: Verification & Testing

### DNS Propagation Check:
```bash
# Check DNS resolution
nslookup polybot.online
nslookup api.polybot.online

# Check from multiple locations
dig @8.8.8.8 polybot.online
dig @1.1.1.1 api.polybot.online
```

### Online Tools:
- **DNS Checker**: dnschecker.org
- **What's My DNS**: whatsmydns.net
- **DNS Propagation**: dnspropagation.net

### Test Your Deployment:
```bash
# Frontend health check
curl -I https://polybot.online

# Backend API health check  
curl https://api.polybot.online/health

# Multi-agent dispatch test
curl -X POST https://api.polybot.online/dispatch \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test deployment","agents":["openai"]}'
```

---

## Complete Configuration Example

### Domain: polybot.online
### Registrar: Namecheap
### DNS Provider: Cloudflare
### Frontend: Vercel
### Backend: Railway

**Steps**:
1. **Buy domain** at Namecheap
2. **Add to Cloudflare**, get nameservers: `alice.ns.cloudflare.com`, `bob.ns.cloudflare.com`
3. **Update nameservers** in Namecheap dashboard
4. **Add DNS records** in Cloudflare:
   ```
   CNAME | @ | cname.vercel-dns.com | Proxied
   CNAME | www | cname.vercel-dns.com | Proxied  
   CNAME | api | polybot-backend-production.up.railway.app | Proxied
   ```
5. **Configure domains** in hosting dashboards:
   - Vercel: Add `polybot.online` and `www.polybot.online`
   - Railway: Add `api.polybot.online`

---

## Timeline Expectations

- **Domain purchase**: Instant
- **Nameserver update**: 24-48 hours (usually 2-6 hours)
- **DNS propagation**: 24-48 hours (usually 15 minutes - 2 hours)  
- **SSL certificate**: 5-15 minutes after DNS resolves

## Troubleshooting

### Common Issues:
1. **"Domain not found"**: DNS not propagated yet - wait 2-6 hours
2. **SSL certificate error**: Domain not verified yet - check DNS records
3. **502/504 errors**: Backend not responding - check Railway deployment
4. **CORS errors**: API domain mismatch - verify DNS points to correct backend

### Quick Fixes:
```bash
# Clear DNS cache
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns             # Windows
sudo systemctl restart systemd-resolved  # Linux

# Test different DNS servers
nslookup polybot.online 8.8.8.8
nslookup polybot.online 1.1.1.1
```

---

## 🎯 Final Checklist

- [ ] Domain purchased: `polybot.online`
- [ ] Nameservers updated at registrar
- [ ] DNS records configured
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway  
- [ ] Custom domains added in hosting dashboards
- [ ] SSL certificates generated
- [ ] API endpoints responding
- [ ] Frontend loads correctly

**Expected result**: `https://polybot.online` loads your Polybot Genesis interface and makes successful API calls to `https://api.polybot.online`! 🚀
