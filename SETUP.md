# CleanSL Admin Frontend Setup

## Active Backend

This frontend is paired with the workspace backend at:

```text
..\backend
```

The API client expects:

```text
http://localhost:8000
```

## Start Backend

```bash
cd ..\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Start Frontend

```bash
npm install
npm start
```

## URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
