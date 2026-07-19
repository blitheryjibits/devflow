# Use official Node LTS (Linux)
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev", "--", "--turbo", "false"]
