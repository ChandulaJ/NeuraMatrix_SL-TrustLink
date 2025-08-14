# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm ci

# Install TypeScript globally (optional, but not required if using local tsc)
# RUN npm install -g typescript

# Copy the rest of the source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose the port your service runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
