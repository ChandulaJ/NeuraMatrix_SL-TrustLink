# Use an official Node.js 16 image as a base
FROM node:22

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port the server will run on
EXPOSE 3000

# Run the command to start the server when the container launches
CMD ["npm", "start"]