# Local Development Setup - Complete ✅

## Infrastructure Status

All services are now running locally without Docker:

### Services Running
- **Frontend**: http://localhost:3000 (Next.js development server)
- **Backend API**: http://localhost:3001 (NestJS server)
- **Database**: postgresql://postgres@localhost:5432/task_management_db (PostgreSQL 14)

### Verification
✅ Frontend: Port 3000 is open and responding
✅ Backend: Port 3001 is open and responding
✅ Database: Port 5432 is open and responding
✅ API Login: Successfully tested with demo credentials
✅ Database Schema: Synced and seeded with demo data

---

## Demo Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: ADMIN (Full access to all features)

### Regular User Account
- **Email**: user@example.com
- **Password**: user123
- **Role**: USER (Limited to assigned tasks)

---

## Frontend Usage

Access the application at: **http://localhost:3000**

### Login Page Features
- Dark theme with modern gradient background
- Glassmorphism card design
- Password visibility toggle
- Pre-filled demo credentials display
- Visual feedback with icons (Mail, Lock, CheckCircle2, AlertCircle)
- Smooth hover animations and transitions

### Dashboard
After login, access:
- Task management (Create, Read, Update, Delete)
- Task status updates
- Task assignment (Admin only)
- Audit logs viewing

---

## Backend API Endpoints

Base URL: `http://localhost:3001`

### Authentication
- **POST** `/auth/login` - Login with email/password
  ```bash
  curl -X POST http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"admin123"}'
  ```

### Tasks (Requires JWT Token)
- **POST** `/tasks` - Create task
- **GET** `/tasks` - List all tasks
- **GET** `/tasks/:id` - Get task details
- **PATCH** `/tasks/:id` - Update task
- **DELETE** `/tasks/:id` - Delete task
- **PATCH** `/tasks/:id/status` - Update task status
- **PATCH** `/tasks/:id/assign` - Assign task to user

### Audit Logs
- **GET** `/audit-logs` - View all audit logs
- **GET** `/audit-logs/task/:taskId` - View task-specific audit

---

## Development Workflow

### Starting Services (after reboot/restart)

1. **Start PostgreSQL** (if not running):
   ```bash
   brew services start postgresql@14
   ```

2. **Start Backend**:
   ```bash
   cd /Users/apple/Desktop/Task-management-system/apps/backend
   DATABASE_URL="postgresql://postgres@localhost:5432/task_management_db" npm run start:dev
   ```

3. **Start Frontend** (in new terminal):
   ```bash
   cd /Users/apple/Desktop/Task-management-system/apps/frontend
   npm run dev
   ```

### Quick Start Script
```bash
#!/bin/bash
# Save as: start-local-dev.sh

# Start PostgreSQL
brew services start postgresql@14

# Start Backend
cd /Users/apple/Desktop/Task-management-system/apps/backend
DATABASE_URL="postgresql://postgres@localhost:5432/task_management_db" npm run start:dev &

# Start Frontend
cd /Users/apple/Desktop/Task-management-system/apps/frontend
npm run dev
```

---

## Database Management

### View Database
```bash
psql task_management_db
```

### Reset Database
```bash
cd /Users/apple/Desktop/Task-management-system/apps/backend
DATABASE_URL="postgresql://postgres@localhost:5432/task_management_db" npx prisma db push --accept-data-loss
DATABASE_URL="postgresql://postgres@localhost:5432/task_management_db" npx ts-node prisma/seed.ts
```

### Prisma Studio (Visual DB Editor)
```bash
cd /Users/apple/Desktop/Task-management-system/apps/backend
DATABASE_URL="postgresql://postgres@localhost:5432/task_management_db" npx prisma studio
# Opens at http://localhost:5555
```

---

## Troubleshooting

### Backend fails to start
- Ensure PostgreSQL is running: `brew services list`
- Verify DATABASE_URL is correct
- Check if port 3001 is available: `lsof -i :3001`

### Frontend shows errors
- Clear `.next` cache: `cd apps/frontend && rm -rf .next`
- Rebuild: `npm run build`
- Restart dev server

### Database connection issues
- Check PostgreSQL status: `brew services list`
- Verify database exists: `psql -l | grep task_management_db`
- Recreate if needed:
  ```bash
  dropdb task_management_db
  createdb task_management_db
  cd apps/backend && npx prisma db push --accept-data-loss
  ```

### Port already in use
```bash
# Kill process on port
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL
kill -9 <PID>
```

---

## Project Structure

```
Task-management-system/
├── apps/
│   ├── backend/              # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/        # JWT authentication
│   │   │   ├── tasks/       # Task management
│   │   │   ├── users/       # User management
│   │   │   ├── audits/      # Audit logging
│   │   │   └── prisma.service.ts  # DB service
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   └── seed.ts             # Demo data
│   │   ├── .env.backend            # Environment config
│   │   └── dist/             # Compiled JavaScript
│   │
│   └── frontend/             # Next.js React app
│       ├── app/
│       │   ├── login/        # Login page
│       │   ├── dashboard/    # Main dashboard
│       │   └── layout.tsx    # Root layout
│       ├── lib/
│       │   ├── auth-store.ts # Zustand auth state
│       │   └── axios-client.ts # HTTP client
│       └── .next/            # Next.js build output
│
└── pnpm-lock.yaml           # Monorepo lock file
```

---

## Environment Variables

### Backend (.env.backend)
```env
DATABASE_URL="postgresql://postgres@localhost:5432/task_management_db"
JWT_SECRET="your-super-secret-jwt-key-local-dev-only"
AUTH_BEARER_TOKEN="admin-bearer-token-local"
NODE_ENV="development"
```

### Stack Information
- **Runtime**: Node.js v22.14.0
- **Package Manager**: pnpm v10.17.1
- **Frontend**: Next.js 16.2.2, React 19.2.4, Tailwind CSS 4.2.2
- **Backend**: NestJS 11.0.1
- **Database**: PostgreSQL 14
- **ORM**: Prisma v7 with @prisma/adapter-pg

---

## Performance Notes

### First Start
- Backend compilation: ~5-10 seconds
- Frontend hot reload: ~1-2 seconds
- First page load: ~3-5 seconds

### Iterative Development
- Backend hot reload: ~1-2 seconds (file changes)
- Frontend hot reload: ~1-2 seconds (automatic)
- No Docker rebuild needed
-Instant feedback during development

---

## Next Steps

1. ✅ Access frontend at http://localhost:3000
2. ✅ Login with demo credentials
3. ✅ Create and manage tasks
4. ✅ Test full authentication flow
5. ✅ Monitor API calls in browser DevTools
6. Review database changes in Prisma Studio
7. When ready, rebuild Docker for production

---

**Created**: April 8, 2026
**Status**: ✅ All services running and tested
**Database**: ✅ Synced and seeded with demo data
