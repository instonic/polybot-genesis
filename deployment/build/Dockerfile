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
