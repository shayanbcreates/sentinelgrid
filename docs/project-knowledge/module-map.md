# Module Map

_Status: Phase 1 scaffold. Planned modules marked as [planned]._

## Backend (`backend/app/`)

```
app/
├── main.py               App factory, middleware, router registration
├── config.py             Pydantic settings (all env vars)
├── database.py           SQLAlchemy engine, session factory, Base
│
├── models/               ORM models (SQLAlchemy)
│   └── [planned]
│       ├── environment.py    CloudEnvironment
│       ├── resource.py       CloudResource, ResourceRelationship
│       ├── simulation.py     SimulationRun, SecurityEvent
│       ├── incident.py       Incident, Alert
│       └── remediation.py    RemediationAction
│
├── api/routes/           FastAPI routers
│   ├── health.py         GET /api/v1/health
│   └── [planned]
│       ├── environments.py   CRUD /api/v1/environments
│       ├── resources.py      CRUD /api/v1/resources
│       ├── simulations.py    POST /simulate, GET /events (SSE)
│       ├── incidents.py      GET /incidents
│       └── remediation.py    POST /remediation/{id}/approve
│
└── schemas/              Pydantic request/response models
    └── [planned per route]

## Simulation Engine [planned — Phase 4]
engine/
├── simulator.py          Deterministic event-driven engine
├── scenarios/            One file per attack scenario
├── telemetry.py          Synthetic CloudTrail event generator
└── detection/            Rule-based detection engine
```

## Frontend (`frontend/src/`)

```
src/
├── App.tsx               Root component + router
├── main.tsx              Entry point
│
├── types/index.ts        All shared TypeScript types
│
├── stores/
│   └── simulationStore.ts   Zustand: simulation state, events, incidents
│
├── pages/
│   ├── DashboardPage.tsx    Security overview + KPIs
│   ├── SimulationStudioPage.tsx  Attack scenario selector + canvas
│   ├── IncidentsPage.tsx    Incident list + remediation approval
│   └── EventsPage.tsx       Security event feed
│
├── components/
│   ├── ui/
│   │   ├── NavSidebar.tsx   Left navigation
│   │   └── Badge.tsx        Severity badges
│   └── [planned]
│       ├── canvas/          React Flow nodes/edges
│       ├── agents/          Agent activity panels
│       └── timeline/        Incident event timeline
│
├── hooks/
│   └── [planned]
│       ├── useSimulationWebSocket.ts
│       └── useHealthCheck.ts
│
└── lib/
    └── cn.ts               Tailwind class merger
```

## Infrastructure

```
docker-compose.yml        postgres + backend + frontend
.github/workflows/ci.yml  lint + test + build on push
.env.example              All configurable env vars
```
