#!/bin/bash

# Polybot.online Deployment Script
# This script prepares the application for production deployment

echo "🚀 Preparing Polybot Genesis for polybot.online deployment..."

# Create deployment directory
mkdir -p deployment/build

# Copy backend files
echo "📦 Copying backend files..."
cp -r polybot-backend deployment/build/
cd deployment/build/polybot-backend

# Install production dependencies
echo "📥 Installing production dependencies..."
npm install --production

# Copy production environment file
cp ../../.env.production .env

echo "✅ Backend prepared for deployment"

# Go back to root
cd ../../../

# Prepare frontend for production
echo "📦 Preparing frontend..."
# Copy frontend files to deployment
cp -r public deployment/build/frontend

echo "✅ Frontend prepared for deployment"

# Create Docker configuration
cat > deployment/build/Dockerfile << EOF
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend
COPY polybot-backend/ ./

# Install dependencies
RUN npm install --production

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "index.js"]
EOF

# Create docker-compose for easy deployment
cat > deployment/build/docker-compose.yml << EOF
version: '3.8'

services:
  polybot-backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - HOST=0.0.0.0
      - PORT=3000
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  polybot-frontend:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - polybot-backend
    restart: unless-stopped
EOF

# Create Nginx configuration for frontend
cat > deployment/build/nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name polybot.online www.polybot.online;
        
        # Redirect HTTP to HTTPS
        return 301 https://\$server_name\$request_uri;
    }
    
    server {
        listen 443 ssl;
        server_name polybot.online www.polybot.online;
        
        # SSL configuration (add your certificates)
        # ssl_certificate /path/to/your/certificate.crt;
        # ssl_certificate_key /path/to/your/private.key;
        
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files \$uri \$uri/ /index.html;
        }
        
        # API proxy to backend
        location /api/ {
            proxy_pass http://polybot-backend:3000/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF

echo "🎉 Deployment package ready in deployment/build/"
echo ""
echo "📋 Next steps for polybot.online:"
echo "1. Purchase/configure domain: polybot.online"
echo "2. Set up DNS records:"
echo "   - polybot.online → your server IP"
echo "   - api.polybot.online → your server IP"
echo "3. Deploy using Docker: cd deployment/build && docker-compose up -d"
echo "4. Configure SSL certificates (Let's Encrypt recommended)"
echo ""
echo "🌐 Your Polybot Genesis will be live at:"
echo "   Frontend: https://polybot.online"
echo "   API: https://api.polybot.online"
