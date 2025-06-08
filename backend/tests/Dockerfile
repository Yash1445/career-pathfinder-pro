# Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Development image, copy all the files and run the app
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create uploads and logs directories
RUN mkdir -p uploads logs

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express

# Change ownership of the app directory
RUN chown -R express:nodejs /app
USER express

EXPOSE 5000

ENV NODE_ENV=development
ENV PORT=5000

CMD ["npm", "run", "dev"]

# Production image, copy all the files and run the app
FROM base AS prod
WORKDIR /app

# Install production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Create directories
RUN mkdir -p uploads logs

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express

# Change ownership
RUN chown -R express:nodejs /app
USER express

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["npm", "start"]