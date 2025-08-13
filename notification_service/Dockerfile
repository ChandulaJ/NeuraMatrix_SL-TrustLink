# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Install TypeScript globally for build
RUN npm install -g typescript

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose port (if needed for health checks)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]