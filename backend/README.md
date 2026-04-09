# Backend

NestJS API for the Task Management System.

## What This API Does

This backend provides the data and rules for the app:

- It handles login and creates JWT tokens.
- It stores and returns tasks, users, and audit logs.
- It protects admin-only routes with role checks.
- It seeds demo data when the database is empty.

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

## How The Backend Works

1. `main.ts` starts NestJS, enables validation, and turns on CORS.
2. `app.module.ts` wires TypeORM, config, and the feature modules together.
3. Controllers expose routes such as `/auth/login`, `/tasks`, `/users`, and `/audit-logs`.
4. Services contain the actual business logic.
5. Entities map to PostgreSQL tables.
6. Guards and strategies protect private endpoints with JWT and role checks.
7. The audit service records important actions for later review.

## Main Modules

- `auth/` handles login, JWT signing, and token validation.
- `tasks/` handles task listing, creation, editing, status updates, and deletion.
- `users/` provides user lookup for login and assignee dropdowns.
- `audit/` exposes audit log reads and audit write helpers.
- `database/` contains the seed service used for demo data.
- `entities/` contains the TypeORM models for database tables.
- `common/` contains shared decorators and guards.

## API Flow

- Login request goes to `AuthController` and `AuthService`.
- The backend checks the password, signs a JWT, and logs the login event.
- Protected requests send the JWT in the `Authorization` header.
- `JwtStrategy` loads the user and `JwtAuthGuard` protects the route.
- The relevant service reads or writes database rows through TypeORM.
- `AuditService` stores a history row for important changes.

## Database Tables

- `users` stores account data, roles, and password hashes.
- `tasks` stores task title, assignee, status, and timestamps.
- `audit_logs` stores action history and optional user ownership.

## Key Backend Files

- `src/main.ts` for app bootstrap.
- `src/app.module.ts` for module wiring.
- `src/auth/auth.service.ts` for login logic.
- `src/tasks/tasks.service.ts` for task rules.
- `src/audit/audit.service.ts` for audit writes and reads.
- `src/database/seed.service.ts` for demo data.

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

Set these values to match your local database before starting the server.

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
- If you are learning NestJS, start with `main.ts`, then `app.module.ts`, then one feature module like `tasks/`.
