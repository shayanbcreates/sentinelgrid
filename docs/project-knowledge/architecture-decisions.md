# Architecture Decisions

## ADR-001: Async FastAPI + asyncpg

**Decision:** Use async SQLAlchemy with asyncpg driver throughout the backend.

**Why:** WebSockets and Server-Sent Events (required for real-time simulation events in Phase 8) are non-blocking I/O operations. Using async throughout avoids event-loop blocking under load and keeps the architecture consistent.

**Trade-off:** Slightly more complex than sync SQLAlchemy; asyncpg is PostgreSQL-only.

---

## ADR-002: LangGraph with offline mode default

**Decision:** `OFFLINE_MODE=true` is the default; LangGraph agents run deterministic rule-based logic unless `OFFLINE_MODE=false` and Bedrock credentials are present.

**Why:** Portfolio demos must run without paid AWS services. Agents must function and produce meaningful output for reviewers who have no AWS account.

**How to apply:** Every agent must implement both a `_run_deterministic()` and `_run_llm()` path. The router checks `settings.offline_mode`.

---

## ADR-003: Zustand over Redux for frontend state

**Decision:** Use Zustand for all frontend simulation state.

**Why:** Redux adds significant boilerplate for a single-developer project. Zustand is TypeScript-first, lightweight, and supports the event-driven update pattern needed for simulation feeds.

**Trade-off:** Less devtools support than Redux DevTools (but Zustand has a devtools middleware).

---

## ADR-004: React Flow for topology canvas

**Decision:** Use `@xyflow/react` for the interactive AWS architecture canvas.

**Why:** Mature, actively maintained, supports custom node types, and handles zoom/pan/drag natively. Fits the interactive topology builder requirements in Phase 3.

**How to apply:** Custom node components per resource type (`EC2Node`, `S3Node`, etc.); edges represent network/dependency relationships.

---

## ADR-005: Real AWS operations disabled by default

**Decision:** No AWS API calls are made unless explicitly enabled via environment variable and explicit user approval at runtime.

**Why:** Security requirement. This is a simulation platform. Accidental real-world AWS operations (cost, security, compliance) are unacceptable.

**How to apply:** All AWS SDK calls are gated behind `if not settings.offline_mode` and an additional runtime approval flag. Terraform is infrastructure-as-code only; never auto-applied.
