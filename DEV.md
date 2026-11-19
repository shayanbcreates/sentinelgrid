# SentinelGrid — Developer Notes

## Session Startup Protocol

At the start of every session:
1. Read `docs/project-knowledge/session-handoff.md`
2. Run `git status` and `git log --oneline -5`
3. Identify the current approved development phase
4. Read only the source files relevant to the immediate task

Do NOT recursively read the entire repository at session start.

## Project Overview

SentinelGrid is a multi-agent cloud security operations center with an interactive AWS simulation studio. It is a portfolio-grade engineering proof of concept — not a commercial SaaS.

**Tech stack:**
- Backend: Python 3.12, FastAPI, SQLAlchemy, asyncpg, PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind CSS, React Flow, Zustand
- Agents: LangGraph (optional Amazon Bedrock; deterministic offline mode default)
- Infra: Docker Compose, GitHub Actions, Terraform (Phase 9)

## Directory Layout

```
backend/          FastAPI application
  app/
    main.py       App entry point + CORS + router registration
    config.py     Pydantic settings (env-driven)
    database.py   AsyncSQLAlchemy engine + session factory
    models/       SQLAlchemy ORM models
    api/routes/   FastAPI routers (one file per domain)
    schemas/      Pydantic request/response schemas
  tests/          Pytest test suite
frontend/         Vite + React + TypeScript app
  src/
    types/        Shared TypeScript type definitions
    stores/       Zustand state stores
    pages/        Route-level page components
    components/   Shared UI components
    hooks/        Custom React hooks
    lib/          Pure utilities (cn, api client, etc.)
docs/project-knowledge/   Persistent knowledge base (session handoff, arch decisions)
.github/workflows/        GitHub Actions CI
```

## Development Rules

- Tests must pass before committing
- Use `feat/*`, `fix/*`, `docs/*` branches — never push directly to `main`
- Backend: run `ruff check app tests` and `mypy app` before commit
- Frontend: run `npx tsc --noEmit` before commit
- Real AWS credentials must NEVER be committed
- Real AWS resource deployment requires explicit user approval
- Offline mode (`OFFLINE_MODE=true`) must work without any cloud calls

## Running Locally

```bash
# Backend (from backend/)
uv pip install ".[dev]"
uvicorn app.main:app --reload

# Frontend (from frontend/)
npm install
npm run dev

# Full stack
docker compose up
```

## Current Development Phase

See `docs/project-knowledge/session-handoff.md` for the latest state.
