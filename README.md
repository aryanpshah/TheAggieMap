# The Aggie Map Monorepo

This repository contains the web experience for **The Aggie Map - Aggieland's One Stop Shop**. It is structured as a monorepo with a Next.js frontend and a FastAPI backend scaffold.

## Structure

- `frontend/` - Next.js 14 App Router project (Material UI, Clerk auth, mock API layer).
- `backend/` - FastAPI service returning placeholder data for future integration.

## Getting Started

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. (Optional) Run the backend mock service:
   ```bash
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

Environment variable examples live in `frontend/.env.local.example` and `backend/.env.example`.
