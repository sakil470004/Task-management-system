# Backend (NestJS) - Multi-stage production build
# Stage 1: Builder - Compile TypeScript and build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package management files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the NestJS application
RUN pnpm run build

# Stage 2: Runtime - Run the compiled application
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
COPY --from=builder /app/dist ./dist

# Expose port 5000 for the API
EXPOSE 5000

# Simple health check: ensure the process is running
HEALTHCHECK --interval=15s --timeout=3s --retries=3 --start-period=10s \
  CMD ps aux | grep "node dist/main.js" | grep -v grep || exit 1

# Start the application
CMD ["node", "dist/main.js"]
