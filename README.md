# Internship Application Tracker

A responsive web application for managing internship applications, deadlines,
recruiter contacts, and outcomes.

## Project Status

In development. The MVP supports dashboard statistics, searching and filtering,
application CRUD, Supabase persistence, and private anonymous sessions.

## Technology

- React and TypeScript
- Vite
- Supabase PostgreSQL
- Supabase anonymous authentication
- PostgreSQL Row Level Security

## Repository Structure

- `frontend/` - React web application
- `database/` - PostgreSQL schema and sample SQL
- `docs/` - planning and documentation
- `screenshots/` - application screenshots

## Local Development

1. Enter the frontend directory and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Copy `frontend/.env.example` to `frontend/.env.local` and add your Supabase values:

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

   The publishable key is intended for browser use. Never put a service-role key
   in frontend environment files.

3. Enable anonymous sign-ins in Supabase Authentication.

4. Run `database/schema.sql` in the Supabase SQL editor to create the table,
   indexes, update trigger, grants, and Row Level Security policies.

5. Start the development server:

   ```bash
   npm run dev
   ```

## Data and Security

The application creates or restores an anonymous Supabase session before querying
PostgreSQL. Row Level Security checks `user_id = auth.uid()`, ensuring each user can
only select, insert, update, or delete their own rows.

On a user's first authenticated visit, six fictional applications are inserted if
the account has no records. Completion is stored in Supabase auth metadata so the
sample records do not return after a user deliberately deletes everything.

## Author

Woo Wei Qin
