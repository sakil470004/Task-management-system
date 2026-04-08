# Frontend (Next.js) - Multi-stage production build
# Stage 1: Builder - Install dependencies and build the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package management files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the Next.js application
RUN pnpm run build

# Stage 2: Runtime - Run the production-optimized Next.js application
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files from builder
COPY package.json pnpm-lock.yaml ./

# Install pnpm and production dependencies only
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 3000 for the Next.js application
EXPOSE 3000

# Simple health check: ensure the process is running
HEALTHCHECK --interval=15s --timeout=3s --retries=3 --start-period=10s \
  CMD ps aux | grep "next start" | grep -v grep || exit 1

# Start the Next.js application in production mode
CMD ["pnpm", "start"]
