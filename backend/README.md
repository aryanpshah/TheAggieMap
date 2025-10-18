# The Aggie Map API

This FastAPI service backs The Aggie Map frontend. For now it returns mock data that mirrors the UI layer.

## Getting Started

1. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # macOS / Linux
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy the example environment file and adjust as needed:
   ```bash
   # Windows
   copy .env.example .env
   # macOS / Linux
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   uvicorn main:app --reload --port ${PORT:-8000}
   ```

The API exposes:
- `GET /api/health` - basic health check.
- `GET /api/suggested` - mocked suggested locations (mirrors the frontend placeholder API).

Cross-origin requests are enabled for all origins while the project is in development. Tighten this before production.
