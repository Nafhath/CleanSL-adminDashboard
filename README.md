# CleanSL Admin Dashboard Frontend

React admin dashboard for the CleanSL waste-management project.

## Current Status

The active admin workspace now uses the reorganized structure:

- Frontend: `Admin Dashboard/Frontend`
- Backend: `Admin Dashboard/Backend`
- Mobile app: `Mobile app`

The frontend is deployed separately from the backend:

- Frontend deployment: Vercel
- Backend deployment: Render
- Backend URL: `https://cleansl-backend-9d4g.onrender.com`

In local development, the frontend talks to:

- `http://localhost:8000` when opened on localhost
- `REACT_APP_API_URL` if provided
- otherwise the default remote Render backend

## Key Architecture

The admin frontend does not read Supabase directly.

Current data flow:

- Mobile app -> Supabase
- Admin frontend -> Render backend -> Supabase

That means the dashboard depends on the backend API for:

- admin authentication
- complaint retrieval
- live truck aggregation
- derived violation data
- analytics summaries

## Important Files

- `src/services/api.js`
- `src/pages/Login.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/Overview.jsx`
- `src/pages/LiveMap.jsx`
- `src/pages/FleetStatus.jsx`
- `src/pages/Complaints.jsx`
- `src/pages/Violations.jsx`
- `src/pages/Analytics.jsx`
- `src/pages/Settings.jsx`
- `src/pages/Profile.jsx`

## Admin Authentication

Dashboard staff are no longer mixed into `public.users`.

Current admin auth model:

- backend auth table: `public.admin_users`
- login endpoint: `POST /users/auth/login`
- current seeded admin:
  - email: `admin@cleansl.com`
  - password: `admin123`

Residents and drivers remain in `public.users`.

## Verification

Verified frontend commands used during cleanup:

```bash
npm run build
npm test -- --watchAll=false --runInBand
```

## Handoff Note

For future Codex/model sessions, the main workspace handoff log is:

- `C:\Users\mhmdn\Downloads\Compressed\CleanSL\CODEX_CONTEXT_LOG.md`
