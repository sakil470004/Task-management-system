# Task Management System

Full-stack task management app with a Dockerized PostgreSQL database, a NestJS backend API, and a Next.js frontend.

## Overview

This repository is split into three parts:

- `postgres` service in Docker for the database
- `backend` for the NestJS API
- `frontend` for the Next.js UI

The database is initialized through [init.sql](init.sql) on first container startup.

## Project Structure

```text
Task-management-system/
├── docker-compose.yml
├── init.sql
├── Makefile
├── backend/
└── frontend/
```

### Backend

```text
backend/
├── src/
│   ├── auth/
│   ├── audit/
│   ├── common/
│   ├── database/
│   ├── entities/
│   ├── tasks/
│   └── users/
└── test/
```

### Frontend

```text
frontend/
├── app/
├── components/
├── contexts/
├── hooks/
└── lib/
```

## Requirements

- Node.js 18+ recommended
- pnpm
- Docker and Docker Compose

## Quick Start

### 1. Start the database and app stack with Docker

```bash
docker compose up --build
```

This starts:

- PostgreSQL on port `5432`
- Backend API on port `5000`
- Frontend on port `3000`

### 2. Open the app

- Frontend: http://localhost:3000
- Backend health: http://localhost:5000

## Docker Notes

- PostgreSQL is configured in [docker-compose.yml](docker-compose.yml)
- The database name is `taskmanager`
- The initialization script is mounted into `/docker-entrypoint-initdb.d/`
- If you want a fresh database, run:

```bash
docker compose down -v
docker compose up --build
```

## Makefile Commands

Useful project commands:

```bash
make up
make down
make rebuild
make restart
make ps
make logs
make dev-up
make dev-local-start
make dev-db-start
make dev-db-stop
```

## Development Workflow

You can also run the app locally with the database in Docker:

1. Start PostgreSQL with Docker Compose
2. Run the backend in `backend/`
3. Run the frontend in `frontend/`

See the package READMEs below for exact commands.

## Features

- Login with JWT auth
- Admin dashboard for task create/edit/delete
- User dashboard for task status updates
- Audit log history
- Toast notifications for actions

## Package Docs

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
