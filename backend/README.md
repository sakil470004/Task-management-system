# Backend

NestJS API for the Task Management System.

## Project Structure

```text
backend/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── auth/
│   ├── audit/
│   ├── common/
│   ├── database/
│   ├── entities/
│   ├── tasks/
│   └── users/
└── test/
```

## Features

- JWT login
- Role-based authorization
- Task CRUD and task status updates
- Audit log persistence
- PostgreSQL integration via TypeORM

## Setup

```bash
pnpm install
```

## Environment

The backend reads these variables:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=taskmanager
JWT_SECRET=super-secret-change-me
JWT_EXPIRES_IN=1d
PORT=5000
```

## Run Locally

Start PostgreSQL first, then run the backend:

```bash
pnpm dev
```

The API will listen on:

- http://localhost:5000

## Build

```bash
pnpm build
```

## Test

```bash
pnpm test
pnpm test:cov
pnpm test:e2e
```

## Lint

```bash
pnpm lint
```

## Database Initialization

- `docker-compose.yml` starts PostgreSQL with the `taskmanager` database
- [init.sql](../init.sql) creates tables and grants privileges on first container startup
- If you need a clean database, run:

```bash
docker compose down -v
docker compose up --build
```

## Notes

- `src/database/seed.service.ts` seeds demo users and tasks when the database is empty.
- The backend is designed to be used with the frontend in the root repository.
