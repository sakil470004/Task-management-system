# Frontend

Next.js frontend for the Task Management System.

## What This App Does

This frontend shows the task management UI for two roles:

- Users can log in and update the status of their assigned tasks.
- Admins can create, edit, delete, and reassign tasks.
- The audit log page shows recent important actions.

The UI talks to the NestJS backend through `NEXT_PUBLIC_API_URL` and keeps the login session in browser storage so refresh still works in development.

## Project Structure

```text
frontend/
├── app/
│   ├── admin/
│   ├── login/
│   ├── user/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── contexts/
├── hooks/
└── lib/
```

## Features

- Login page with JWT-based auth flow
- User dashboard with task status updates
- Admin dashboard with create/edit/delete task actions
- Audit logs page
- Toast notifications for action feedback

## Main Pages

- `/login` is the entry point for signing in.
- `/user/dashboard` shows the current user's tasks.
- `/admin/dashboard` shows the admin task table and task form actions.
- `/admin/audit-logs` shows the audit trail.

## Frontend Flow

1. The user signs in on the login page.
2. The frontend stores the JWT-backed session data in browser storage.
3. Protected pages load tasks, users, and audit logs from the backend.
4. Actions such as create, edit, status change, delete, and logout show toast feedback.

## Key Frontend Folders

- `app/` holds the route pages and layout.
- `components/` holds shared UI like the shell, modal, status badge, and toaster.
- `contexts/` holds app state for auth, tasks, and audit data.
- `hooks/` exposes reusable access to app state.
- `lib/` contains API helpers, mock data, and shared types.

## Setup

```bash
pnpm install
```

## Run Locally

Start the backend and database first, then run the frontend:

```bash
pnpm dev
```

Open:

- http://localhost:3000

## Build

```bash
pnpm build
```

## Lint

```bash
pnpm lint
```

## Environment

The frontend expects the backend API URL in:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If you run the backend on a different host or port, update this value before starting the frontend.

## Useful Commands

- `pnpm dev` starts the local development server.
- `pnpm build` creates a production build.
- `pnpm lint` checks the frontend code.

## Notes

- The UI is optimized for local development and demo use.
- Auth state is persisted in browser storage so refresh keeps the session.
- The frontend is designed to work with the backend API in this repository, not a separate remote service.
