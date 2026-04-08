# Makefile for Task Management System - Docker Compose CLI
# Provides convenient commands for managing services with docker-compose

.PHONY: help up down rebuild logs logs-api logs-web logs-postgres clean ps shell-api shell-web shell-postgres dev-up dev-down dev-logs dev-logs-api dev-logs-web dev-ps dev-clean dev-db-start dev-db-stop dev-local-start dev-db-logs

# Default target - show help
help:
	@echo "📦 Task Management System - Docker Compose Commands"
	@echo ""
	@echo "Usage: make [command]"
	@echo ""
	@echo "Available commands:"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  up              Start all services (postgres, api, web)"
	@echo "  down            Stop all running services"
	@echo "  rebuild         Full restart with clean build (remove containers and rebuild images)"
	@echo "  restart         Restart all services without rebuilding"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  logs            View logs from all services (streaming)"
	@echo "  logs-api        View logs from backend API service only"
	@echo "  logs-web        View logs from frontend web service only"
	@echo "  logs-postgres   View logs from PostgreSQL database service only"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  ps              Show running containers and their status"
	@echo "  clean           Remove containers, volumes, and orphaned services"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  shell-api       Open interactive shell in backend container"
	@echo "  shell-web       Open interactive shell in frontend container"
	@echo "  shell-postgres  Connect to PostgreSQL database as admin user"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  🔥 DEVELOPMENT COMMANDS (with hot reload):"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  dev-up          Start all services in development mode (hot reload enabled)"
	@echo "  dev-down        Stop all development services"
	@echo "  dev-logs        View logs from all dev services (streaming)"
	@echo "  dev-logs-api    View logs from backend API service in dev mode"
	@echo "  dev-logs-web    View logs from frontend web service in dev mode"
	@echo "  dev-ps          Show running dev containers and their status"
	@echo "  dev-clean       Remove dev containers, volumes, and orphaned services"
	@echo ""
	@echo "  💻 LOCAL DEVELOPMENT (Hot Reload on File Changes - RECOMMENDED):"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  dev-db-start    Start ONLY PostgreSQL in Docker (no image rebuild)"
	@echo "  dev-db-stop     Stop PostgreSQL container"
	@echo "  dev-db-logs     View PostgreSQL logs"
	@echo "  dev-local-start Start backend & frontend on your machine (auto hot reload)"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  🚀 EXAMPLES:"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  make up                 # Start all services (production)"
	@echo "  make dev-local-start    # Best for development: DB in Docker, app on host (hot reload)"
	@echo "  make dev-db-start       # Start only PostgreSQL"
	@echo "  make rebuild            # Restart everything with fresh build"
	@echo ""

# Start all services (builds images if not present, then starts containers)
up:
	@echo "🚀 Starting all services (postgres, api, web)..."
	docker-compose up -d --build
	@echo "✅ Services are starting..."
	@echo "   📱 Frontend:  http://localhost:3000"
	@echo "   🔌 Backend:   http://localhost:5000"
	@echo "   🗄️  Database:  localhost:5432 (user: admin, password: admin)"
	@echo ""
	@echo "Run 'make ps' to see service status or 'make logs' to view logs"

# Stop all services gracefully
down:
	@echo "🛑 Stopping all services..."
	docker-compose down
	@echo "✅ All services stopped"

# Full rebuild: Stop, remove containers/images, rebuild, and restart
rebuild: down
	@echo "🔄 Rebuilding all images and services (clean restart)..."
	docker-compose up -d --build
	@echo "✅ Full rebuild complete!"
	@echo "   📱 Frontend:  http://localhost:3000"
	@echo "   🔌 Backend:   http://localhost:5000"
	@echo "   🗄️  Database:  localhost:5432"

# Restart services without rebuilding
restart:
	@echo "🔄 Restarting all services..."
	docker-compose restart
	@echo "✅ All services restarted"

# View streaming logs from all services
logs:
	@echo "📋 Streaming logs from all services (Ctrl+C to exit)..."
	docker-compose logs -f

# View streaming logs from backend API service only
logs-api:
	@echo "📋 Streaming logs from backend API service (Ctrl+C to exit)..."
	docker-compose logs -f api

# View streaming logs from frontend service only
logs-web:
	@echo "📋 Streaming logs from frontend service (Ctrl+C to exit)..."
	docker-compose logs -f web

# View streaming logs from PostgreSQL service only
logs-postgres:
	@echo "📋 Streaming logs from PostgreSQL service (Ctrl+C to exit)..."
	docker-compose logs -f postgres

# Show status of all containers
ps:
	@echo "📊 Container Status:"
	@docker-compose ps

# Remove containers, networks, and optionally volumes
clean:
	@echo "🧹 Cleaning up containers and volumes..."
	docker-compose down -v
	@echo "✅ Cleanup complete (all volumes removed)"

# Open interactive shell in backend container
shell-api:
	@echo "🔧 Connecting to backend container shell..."
	docker-compose exec api sh

# Open interactive shell in frontend container
shell-web:
	@echo "🔧 Connecting to frontend container shell..."
	docker-compose exec web sh

# Connect to PostgreSQL database as admin user
shell-postgres:
	@echo "🗄️  Connecting to PostgreSQL database..."
	docker-compose exec postgres psql -U admin -d taskmanager

# ═══════════════════════════════════════════════════════════════════════════
# 🔥 DEVELOPMENT COMMANDS (Hot Reload Support)
# ═══════════════════════════════════════════════════════════════════════════

# Start all services in development mode with hot reload (Docker-based)
dev-up:
	@echo "🔥 Starting all services in DEVELOPMENT mode (hot reload enabled)..."
	docker-compose -f docker-compose.dev.yml up -d --build
	@echo "✅ Development services are starting..."
	@echo "   📱 Frontend:  http://localhost:3000 (hot reload on file changes)"
	@echo "   🔌 Backend:   http://localhost:5000 (hot reload on file changes)"
	@echo "   🗄️  Database:  localhost:5432 (user: admin, password: admin)"
	@echo ""
	@echo "Files in 'backend/src' and 'frontend/app' will auto-reload on changes"
	@echo "Run 'make dev-logs' to view streaming logs"

# Stop development services gracefully  
dev-down:
	@echo "🛑 Stopping development services..."
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Development services stopped"

# View streaming logs from all development services
dev-logs:
	@echo "📋 Streaming logs from all development services (Ctrl+C to exit)..."
	docker-compose -f docker-compose.dev.yml logs -f

# View streaming logs from backend API service in dev mode
dev-logs-api:
	@echo "📋 Streaming logs from backend API service (Ctrl+C to exit)..."
	docker-compose -f docker-compose.dev.yml logs -f api

# View streaming logs from frontend service in dev mode
dev-logs-web:
	@echo "📋 Streaming logs from frontend web service (Ctrl+C to exit)..."
	docker-compose -f docker-compose.dev.yml logs -f web

# Show status of all development containers
dev-ps:
	@echo "📊 Development Container Status:"
	@docker-compose -f docker-compose.dev.yml ps

# Remove development containers, networks, and volumes
dev-clean:
	@echo "🧹 Cleaning up development containers and volumes..."
	docker-compose -f docker-compose.dev.yml down -v
	@echo "✅ Development cleanup complete (all dev volumes removed)"

# ═══════════════════════════════════════════════════════════════════════════
# 💻 LOCAL DEVELOPMENT (Recommended for hot reload)
# PostgreSQL in Docker + Frontend/Backend on your machine
# ═══════════════════════════════════════════════════════════════════════════

# Start ONLY PostgreSQL in Docker (no image rebuild - fast!)
dev-db-start:
	@echo "🐘 Starting PostgreSQL in Docker (local development)..."
	docker-compose -f docker-compose.local.yml up -d
	@echo "✅ PostgreSQL is ready!"
	@echo "   🗄️  Database:  localhost:5432"
	@echo "   👤 User:      admin"
	@echo "   🔑 Password:  admin"
	@echo "   📊 Database:  taskmanager"
	@echo ""
	@echo "Now run: make dev-local-start"

# Stop PostgreSQL container
dev-db-stop:
	@echo "🛑 Stopping PostgreSQL..."
	docker-compose -f docker-compose.local.yml down
	@echo "✅ PostgreSQL stopped"

# View PostgreSQL logs
dev-db-logs:
	@echo "📋 PostgreSQL logs (Ctrl+C to exit)..."
	docker-compose -f docker-compose.local.yml logs -f postgres

# Start frontend and backend on your machine with hot reload
dev-local-start:
	@echo "🔥 Starting backend and frontend with HOT RELOAD..."
	@echo ""
	@echo "⚠️  PREREQUISITES:"
	@echo "   • PostgreSQL running: run 'make dev-db-start' in another terminal"
	@echo "   • Node.js installed locally"
	@echo "   • Dependencies installed: 'pnpm install' in both backend/ and frontend/"
	@echo ""
	@echo "Starting services..."
	@echo ""
	@cd backend && npm run start:dev &
	@cd frontend && npm run dev &
	@wait

