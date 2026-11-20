# SentinelGrid — Session Handoff

_Last updated: 2026-11-19_

---

## Current State

**Phase:** Phase 2 — Virtual AWS Environment Engine (complete)
**Branch:** `feat/phase-2-virtual-aws-engine`
**Last commit:** `18a2181`

### Completed

#### Phase 1
- [x] Repository structure, FastAPI + SQLAlchemy scaffold
- [x] Backend health check endpoint
- [x] Frontend: Vite + React 19 + Tailwind + routing (Dashboard, Sim Studio, Incidents, Events)
- [x] Zustand simulation store, shared types
- [x] Docker Compose, GitHub Actions CI

#### Phase 2
- [x] `CloudEnvironment`, `CloudResource`, `ResourceRelationship` SQLAlchemy models
- [x] Alembic migration (revision `70ef2c36b629`)
- [x] REST API: CRUD environments + resources + relationships
- [x] 13 passing tests (in-memory SQLite via conftest fixtures)
- [x] Frontend: Environments page (two-panel: env list + resource grid)
- [x] `src/lib/api.ts` API client
- [x] API-aligned TypeScript types in `types/index.ts`
- [x] "Environments" nav item added

---

## Technical Context

### Key Files

| Path | Purpose |
|------|---------|
| `backend/app/main.py` | FastAPI app, CORS, all router registration |
| `backend/app/config.py` | Settings (env-driven) |
| `backend/app/database.py` | AsyncSQLAlchemy engine + `get_db` dep + `Base` |
| `backend/app/models/environment.py` | `CloudEnvironment` model |
| `backend/app/models/resource.py` | `CloudResource` model |
| `backend/app/models/relationship.py` | `ResourceRelationship` model |
| `backend/app/schemas/environment.py` | Environment Pydantic schemas |
| `backend/app/schemas/resource.py` | Resource + Relationship Pydantic schemas |
| `backend/app/api/routes/environments.py` | `/api/v1/environments` CRUD |
| `backend/app/api/routes/resources.py` | `/api/v1/environments/{id}/resources`, `/api/v1/resources/{id}`, `/api/v1/relationships` |
| `backend/alembic/` | Alembic migration setup |
| `backend/tests/conftest.py` | Shared pytest fixtures (in-memory SQLite test DB) |
| `frontend/src/lib/api.ts` | Typed API client wrapping fetch |
| `frontend/src/pages/EnvironmentsPage.tsx` | Environment list + resource grid UI |
| `frontend/src/types/index.ts` | All shared types (Phase 2 API types prefixed `Record`) |

### Architecture Decisions

- Async SQLAlchemy (asyncpg) chosen for WebSocket + SSE compatibility
- `offline_mode=true` default: deterministic agent behavior with no LLM calls
- Tests use `sqlite+aiosqlite:///:memory:` via dependency override — no Postgres required locally
- `sqlalchemy[asyncio]` extra needed for greenlet; `aiosqlite` dev dep for tests
- `JSON` type used (not `JSONB`) in models for SQLite test compat; Alembic migration uses `sa.JSON()`

---

## Validation

- Backend: 13/13 tests passing (`uv run pytest tests/ -v`)
- Frontend build: clean (`npm run build` — 0 TS errors)
- Lint: clean (`uv run ruff check .`)

---

## Next Steps (Phase 3 — Attack Simulation Engine)

### Goal
Run multi-step attack scenarios against the virtual AWS environment. Each scenario generates synthetic security events that the detection agent will process.

### Deliverables
1. **Attack scenario definitions** — data model for scenario steps (e.g., `COMPROMISED_IAM_CREDENTIALS`)
2. **Simulation run model** — `SimulationRun` DB model (env_id, scenario, status, started_at, completed_at)
3. **Scenario engine** — deterministic step runner (no LLM in offline mode): emits `SecurityEvent` records
4. **WebSocket endpoint** — stream simulation events to frontend in real time
5. **Frontend SimStudio** — connect existing stub to real API, show live event feed
6. **Tests** — scenario engine unit tests

### Phase 3 Preview (DB models)
- `SimulationRun` (id, environment_id, scenario, status, started_at, completed_at)
- `SecurityEvent` (id, simulation_run_id, event_name, event_source, timestamp, source_ip, user_agent, resource_arn, severity, raw JSON)
