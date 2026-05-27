# Frontend Dockerfile - Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve untuk serve static files
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5173

# Use serve to run built app (not npm start)
CMD ["serve", "-s", "dist", "-l", "5173"]
