#!/bin/bash

# 🌐 DNS Configuration Checker for polybot.online
# This script helps verify your DNS setup is correct

echo "🌐 Checking DNS configuration for polybot.online..."
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📋 DNS Configuration Checklist:"
echo ""

# Check if domain resolves
echo "1. 🔍 Checking if polybot.online resolves..."
if nslookup polybot.online >/dev/null 2>&1; then
    echo -e "   ${GREEN}✅ polybot.online resolves${NC}"
    MAIN_IP=$(nslookup polybot.online | grep -A1 "Name:" | tail -1 | awk '{print $2}')
    echo "   📍 Points to: $MAIN_IP"
else
    echo -e "   ${RED}❌ polybot.online does not resolve${NC}"
    echo "   💡 Check nameservers and DNS records"
fi

echo ""

# Check API subdomain
echo "2. 🔍 Checking if api.polybot.online resolves..."
if nslookup api.polybot.online >/dev/null 2>&1; then
    echo -e "   ${GREEN}✅ api.polybot.online resolves${NC}"
    API_IP=$(nslookup api.polybot.online | grep -A1 "Name:" | tail -1 | awk '{print $2}')
    echo "   📍 Points to: $API_IP"
else
    echo -e "   ${RED}❌ api.polybot.online does not resolve${NC}"
    echo "   💡 Add CNAME record for api subdomain"
fi

echo ""

# Check SSL certificates
echo "3. 🔒 Checking SSL certificates..."

if command_exists openssl; then
    echo "   🔍 Checking polybot.online SSL..."
    if timeout 10 openssl s_client -connect polybot.online:443 -servername polybot.online </dev/null >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ polybot.online SSL certificate valid${NC}"
    else
        echo -e "   ${YELLOW}⏳ polybot.online SSL not ready (may still be provisioning)${NC}"
    fi
    
    echo "   🔍 Checking api.polybot.online SSL..."
    if timeout 10 openssl s_client -connect api.polybot.online:443 -servername api.polybot.online </dev/null >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ api.polybot.online SSL certificate valid${NC}"
    else
        echo -e "   ${YELLOW}⏳ api.polybot.online SSL not ready (may still be provisioning)${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  openssl not found - skipping SSL check${NC}"
fi

echo ""

# Check HTTP responses
echo "4. 🌐 Checking HTTP responses..."

if command_exists curl; then
    echo "   🔍 Testing https://polybot.online..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://polybot.online || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "   ${GREEN}✅ Frontend responding (HTTP $HTTP_CODE)${NC}"
    elif [ "$HTTP_CODE" = "000" ]; then
        echo -e "   ${RED}❌ Frontend not accessible${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Frontend responding with HTTP $HTTP_CODE${NC}"
    fi
    
    echo "   🔍 Testing https://api.polybot.online/health..."
    API_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://api.polybot.online/health || echo "000")
    if [ "$API_CODE" = "200" ]; then
        echo -e "   ${GREEN}✅ Backend API responding (HTTP $API_CODE)${NC}"
        # Get health response
        HEALTH_RESPONSE=$(curl -s https://api.polybot.online/health 2>/dev/null)
        if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
            echo -e "   ${GREEN}✅ Backend health check passing${NC}"
        fi
    elif [ "$API_CODE" = "000" ]; then
        echo -e "   ${RED}❌ Backend API not accessible${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Backend API responding with HTTP $API_CODE${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  curl not found - skipping HTTP checks${NC}"
fi

echo ""

# Check from multiple DNS servers
echo "5. 🌍 Checking DNS propagation from different servers..."
declare -a dns_servers=("8.8.8.8" "1.1.1.1" "208.67.222.222" "9.9.9.9")

for dns in "${dns_servers[@]}"; do
    echo "   🔍 Checking via $dns..."
    if dig @$dns polybot.online +short >/dev/null 2>&1; then
        RESULT=$(dig @$dns polybot.online +short | head -1)
        echo -e "   ${GREEN}✅ $dns: $RESULT${NC}"
    else
        echo -e "   ${RED}❌ $dns: No response${NC}"
    fi
done

echo ""
echo "🎯 Summary:"
echo ""

# Overall status
if nslookup polybot.online >/dev/null 2>&1 && nslookup api.polybot.online >/dev/null 2>&1; then
    echo -e "${GREEN}🎉 DNS configuration looks good!${NC}"
    echo ""
    echo "🌐 Your Polybot Genesis should be accessible at:"
    echo "   Frontend: https://polybot.online"
    echo "   API: https://api.polybot.online"
    echo "   Health: https://api.polybot.online/health"
    echo ""
    echo "💡 If you're still seeing issues:"
    echo "   - DNS changes can take up to 48 hours to fully propagate"
    echo "   - Try clearing your browser cache and DNS cache"
    echo "   - Check your hosting provider dashboards for any errors"
else
    echo -e "${YELLOW}⏳ DNS configuration in progress...${NC}"
    echo ""
    echo "📋 Next steps:"
    echo "1. Verify nameservers are updated at your domain registrar"
    echo "2. Check DNS records in your DNS provider dashboard"
    echo "3. Wait 2-6 hours for DNS propagation"
    echo "4. Run this script again to recheck"
    echo ""
    echo "📚 See DNS-NAMESERVER-GUIDE.md for detailed instructions"
fi

echo ""
echo "🔄 Run this script again anytime: ./check-dns.sh"
