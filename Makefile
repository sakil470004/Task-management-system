# Makefile for Task Management System - Docker Compose CLI
# Provides convenient commands for managing services with docker-compose

.PHONY: help up down rebuild logs logs-api logs-web logs-postgres clean ps shell-api shell-web shell-postgres

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
	@echo "Examples:"
	@echo "  make up                 # Start all services"
	@echo "  make logs-api           # View backend logs"
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
