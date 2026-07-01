# Internship Application Tracker - Project Plan

## Problem

Students often manage internship applications across spreadsheets, bookmarks, and
email threads. This makes deadlines, follow-ups, and outcomes difficult to track.

## Proposed Solution

Build a web application that lets students manage applications, monitor deadlines,
and review progress from one dashboard.

## Target Users

- University and polytechnic students
- Fresh graduates
- Internship and job seekers

## MVP Features

### Application Management

- Add, edit, and delete applications
- Record company, role, location, status, and relevant dates
- Save job links, recruiter details, and notes
- Search by company or role and filter by status

### Dashboard

- Total and active applications
- Interview and offer counts
- Responsive application table

### Persistence and Security

- Supabase PostgreSQL CRUD through a typed service layer
- Anonymous authentication without a registration screen
- Row Level Security limiting access to rows owned by `auth.uid()`
- Six fictional starter records initialized once for new anonymous users

## Technology

- React
- TypeScript
- Vite
- Supabase PostgreSQL
- Supabase anonymous authentication
- PostgreSQL Row Level Security

## Development Approach

The project began as a frontend prototype with local sample data and localStorage.
Supabase PostgreSQL is now the source of truth. The UI maps database rows into a
separate camelCase domain model, while all queries remain in a reusable service.

Sample-data completion is recorded in Supabase auth metadata. This makes the setup
safe across React Strict Mode remounts and prevents reseeding after deliberate
deletion.

## Current Status

### Completed

- Responsive dashboard and live statistics
- Search and status filtering
- Validated add, edit, and delete workflows
- Supabase CRUD and anonymous authentication
- Per-user Row Level Security
- One-time starter-data initialization

### Next

- Automated tests
- Sorting and expanded dashboard insights
- CSV export
- Deadline reminders
- Optional permanent account upgrade
