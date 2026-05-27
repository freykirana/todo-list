# Switch from Alpine to Debian-based node:20-slim for better Prisma compatibility
FROM node:20-slim

# Install OpenSSL dependencies using apt-get (Debian package manager)
RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
RUN npm install

# Copy all project source code
COPY . .

# Generate Prisma Client inside container
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Auto-sync database tables then start server
CMD npx prisma db push --skip-generate && npm start
