-- PostgreSQL initialization script for Task Management System
-- This script is executed once on first container startup
-- It is idempotent, meaning it can be run multiple times without errors

-- Note: The admin user and taskmanager database are already created by Docker environment variables
-- This script ensures the setup is complete and can add additional initialization as needed

-- Verify the database exists and is accessible
-- Grant all privileges on taskmanager database to admin user (idempotent)
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO admin;

-- Connect to taskmanager database for schema setup
\c taskmanager;

-- Grant all privileges on public schema to admin user
GRANT ALL PRIVILEGES ON SCHEMA public TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO admin;

-- Placeholder for future table creation and schema migrations
-- Example (uncomment when ready to add tables):
-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   password_hash VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- CREATE TABLE IF NOT EXISTS tasks (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   title VARCHAR(255) NOT NULL,
--   description TEXT,
--   status VARCHAR(50) DEFAULT 'pending',
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Log successful initialization
\echo 'TaskManager database initialized successfully!'
