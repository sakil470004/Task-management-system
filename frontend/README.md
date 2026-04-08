# Frontend

Next.js frontend for the Task Management System.

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

## Notes

- The UI is optimized for local development and demo use.
- Auth state is persisted in browser storage so refresh keeps the session.
