# CleanSL Admin Frontend Setup

## Active Workspace Pairing

This frontend is paired with:

- Frontend root: `Admin Dashboard/Frontend`
- Backend root: `Admin Dashboard/Backend`

## Local Backend Startup

From the workspace root:

```bash
cd "Admin Dashboard/Backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Local Frontend Startup

From the frontend root:

```bash
npm install
npm start
```

## Local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## Remote Deployment Pairing

- Backend: `https://cleansl-backend-9d4g.onrender.com`
- Frontend: Vercel deployment

If needed, set:

```env
REACT_APP_API_URL=https://cleansl-backend-9d4g.onrender.com
```

## Data Flow Reminder

The frontend does not talk to Supabase directly.

Current production flow:

- mobile app -> Supabase
- admin frontend -> backend -> Supabase
