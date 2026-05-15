# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# SignatureTrips - Claude Development Guide

**Project**: SignatureTrips - Personalized Travel Recommendation App
**Stack**: React 18 + TypeScript + Spring Boot 4.0.5 + PostgreSQL 16
**Repo**: https://github.com/ENG-SOFT-SMART-TOUR/trips-signature
**Jira Board**: SM_SignatureTrips at signaturetrips.atlassian.net (project key: YGG)

---

## Quick Start

### Prerequisites
- Java 21 (backend)
- Node.js 18+ with npm (frontend)
- Docker & Docker Compose (PostgreSQL)
- Maven (included via `./mvnw` wrapper)

### Launch Development Environment

```bash
# Terminal 1: Start PostgreSQL (host port 5433)
docker compose up -d

# Terminal 2: Start backend (port 8080)
cd backend
./mvnw spring-boot:run

# Terminal 3: Start frontend (port 5173)
cd frontend
npm install
npm run dev
```

**Access**: Frontend at http://localhost:5173 (proxies `/api` to `:8080`)

---

## Database Setup

PostgreSQL 16 (Alpine) running via Docker:
- **Container**: signaturetrips-db
- **Host port**: 5433 (container internal: 5432) — host 5433 avoids clashing with other local Postgres instances commonly bound to 5432
- **JDBC URL**: `jdbc:postgresql://localhost:5433/signaturetrips`
- **Credentials**: user=`signaturetrips`, password=`signaturetrips`, db=`signaturetrips` (must match `docker-compose.yml` and `application.properties`)
- **DDL**: Hibernate `ddl-auto=update` (auto-creates/updates tables)
- **Data**: DataSeeder populates 19 destinations + activities per destination on first startup

### Database Schema
```
usuarios
├── id (PK), nome, email (UNIQUE), senha, quiz_completo
└── usuario_tags (ElementCollection -> bridge table)

destinos
├── id (PK), nome, descricao (TEXT), foto, pais, categoria (String)
└── destino_tags (ElementCollection -> bridge table)

destinos_salvos
├── id (PK), usuario_id (FK), destino_id (FK)
└── UNIQUE (usuario_id, destino_id)

roteiros
├── id (PK), usuario_id (FK, indexed), destino_id (FK)
├── data_ida, data_volta, criado_em

atividades
├── id (PK), destino_id (FK, indexed)
├── nome, categoria, duracao, turno, descricao, foto, latitude, longitude

roteiro_atividade
├── id (PK), roteiro_id (FK, indexed), atividade_id (FK)
├── dia_numero
└── UNIQUE (roteiro_id, atividade_id, dia_numero)
```

---

## Architecture

### Monorepo Structure
```
trips-signature/
├── backend/
│   └── src/main/java/com/signaturetrips/api/
│       ├── SignatureTripsApplication.java
│       ├── config/
│       │   ├── AppConfig             (exposes BCryptPasswordEncoder bean, factor 10)
│       │   ├── CorsConfig            (allows http://localhost:5173)
│       │   ├── DataSeeder            (CommandLineRunner — seeds destinos + atividades)
│       │   └── GlobalExceptionHandler (@RestControllerAdvice)
│       ├── controller/
│       │   ├── AuthController        (/api/auth/*)
│       │   ├── QuizController        (/api/quiz/*)
│       │   ├── DestinoController     (/api/destinos/*)
│       │   ├── RoteiroController     (/api/roteiros/* — incl. roteiro-atividade endpoints)
│       │   └── AtividadeController   (/api/atividades/*)
│       ├── constant/
│       │   └── QuizConstants         (5 hardcoded quiz questions as a constant)
│       ├── domain/
│       │   ├── entity/
│       │   │   ├── Usuario, Destino, DestinoSalvo
│       │   │   ├── Roteiro           (has calcularTotalDias())
│       │   │   ├── Atividade
│       │   │   └── RoteiroAtividade  (join: roteiro + atividade + diaNumero)
│       │   └── repository/
│       │       ├── UsuarioRepository, DestinoRepository, DestinoSalvoRepository
│       │       ├── RoteiroRepository (findWithAssociacoesById via @EntityGraph)
│       │       ├── AtividadeRepository
│       │       └── RoteiroAtividadeRepository (@EntityGraph, count/find by day)
│       ├── dto/ (Java Records with Jakarta Validation)
│       │   ├── CadastroRequest, LoginRequest, LoginResponse
│       │   ├── DestinoResponse, RoteiroResponse, AtividadeResponse,
│       │   │   RoteiroAtividadeResponse  (every Response DTO has a static from(Entity) factory)
│       │   ├── RoteiroRequest, QuizRequest, RoteiroAtividadeRequest
│       │   └── PerguntaDto, OpcaoDto
│       └── service/
│           ├── AuthService           (BCryptPasswordEncoder injected via constructor)
│           ├── QuizService           (serves QuizConstants, saves user profile/tags)
│           ├── DestinoService
│           ├── RoteiroService
│           ├── AtividadeService      (lists activities by destination)
│           └── RoteiroAtividadeService (add/remove/list activities per day, ownership + limit checks)
│
├── frontend/
│   └── src/
│       ├── App.tsx                   (QueryClientProvider, BrowserRouter, ProtectedRoute)
│       ├── pages/                    (Landing, Login, Register, Quiz, Matches, Dashboard,
│       │                              Itineraries, NewItinerary, EditItinerary, ViewItinerary,
│       │                              DayPreview, ActivityDetail, Diaries, etc.)
│       ├── components/
│       │   ├── AppLayout, PageTransition, EmptyState, NavLink, ItineraryMap
│       │   ├── ActivityCard          (shared activity card, variants: compact/full)
│       │   └── ui/                   (shadcn/ui — do NOT modify)
│       ├── hooks/
│       │   ├── use-mobile, use-toast
│       │   └── useItineraryDays      (builds day list from roteiro API response)
│       ├── lib/
│       │   └── dateUtils             (formatarDia — timezone-safe date formatting)
│       ├── services/api.ts           (axios baseURL=/api; authApi, quizApi, destinoApi,
│       │                              roteiroApi, atividadeApi, roteiroAtividadeApi)
│       ├── store/useStore.ts         (Zustand — only `user` is persisted to localStorage)
│       └── types/index.ts            (Usuario, Destino, Roteiro, Atividade, etc.)
│
└── docker-compose.yml (PostgreSQL 16 Alpine, host port 5433)
```

### Data Flow
```
Frontend (React + Zustand) → Vite proxy (/api → :8080) → Spring REST Controllers
  → Services (business logic) → Repositories (JpaRepository) → Hibernate → PostgreSQL
```

---

## Backend Build & Commands

```bash
cd backend
./mvnw spring-boot:run            # Dev: run with live reload
./mvnw clean package              # Build JAR
./mvnw test                       # Run all tests
./mvnw test -Dtest=AuthServiceTest # Run a specific test class
```

### Key Dependencies
| Dependency | Notes |
|------------|-------|
| Spring Boot 4.0.5 | Java 21 |
| Spring Data JPA | PostgreSQL driver |
| Spring Validation | Jakarta Validation |
| spring-security-crypto | BCryptPasswordEncoder (bean in AppConfig) |
| Lombok | @Getter @Setter @NoArgsConstructor |

### Important Notes
- **DDL**: `ddl-auto=update` in `application.properties`
- **Port**: backend 8080; DB host port 5433
- **CORS**: origins come from `app.cors.allowed-origins` in `application.properties` (comma-separated), read by `CorsConfig` via `@Value`
- **Business rule config**: `roteiro.max-atividades-por-dia=5` in `application.properties` (injected into `RoteiroAtividadeService` via constructor)

---

## Frontend Build & Commands

```bash
cd frontend
npm install
npm run dev        # Dev server (port 5173, hot reload)
npm run build      # Production build (dist/)
npm test           # Vitest
npm run lint       # ESLint
```

### Key Dependencies
React 18.3, React Router 6, TypeScript 5.8 (`strict: false`), Vite 5, Zustand 5,
Axios, Tailwind 3, shadcn/ui, Framer Motion, sonner (toasts), React Query, Zod, React Hook Form.

### Important Notes
- **Path alias**: `@/*` → `./src/*`
- **API proxy**: `/api/*` → `http://localhost:8080` (never hardcode localhost in calls)
- **Zustand persistence**: only `user` is saved to localStorage. `itineraries`, `diaries`,
  `savedDestinations` are in-memory only — pages must hydrate trip data from the API, not rely
  on the store surviving a reload.

---

## API Endpoints

### Authentication
| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| POST | /api/auth/cadastro | CadastroRequest | LoginResponse | 201 |
| POST | /api/auth/login | LoginRequest | LoginResponse | 200 |

### Quiz
| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | /api/quiz/perguntas | - | List\<PerguntaDto\> | 200 |
| POST | /api/quiz/responder | QuizRequest | - | 200 |

### Destinos
| Method | Endpoint | Response | Status |
|--------|----------|----------|--------|
| GET | /api/destinos | List\<DestinoResponse\> | 200 |
| GET | /api/destinos/salvos/{usuarioId} | List\<DestinoResponse\> | 200 |
| POST | /api/destinos/{destinoId}/salvar/{usuarioId} | - | 200 |
| DELETE | /api/destinos/{destinoId}/salvar/{usuarioId} | - | 200 |

### Atividades
| Method | Endpoint | Response | Status |
|--------|----------|----------|--------|
| GET | /api/atividades/destino/{destinoId} | List\<AtividadeResponse\> | 200 |

### Roteiros
| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| POST | /api/roteiros | RoteiroRequest | RoteiroResponse | 201 |
| GET | /api/roteiros/{id} | - | RoteiroResponse | 200 |
| GET | /api/roteiros/usuario/{usuarioId} | - | List\<RoteiroResponse\> | 200 |
| DELETE | /api/roteiros/{id}/usuario/{usuarioId} | - | - | 204 |

### Roteiro ↔ Atividade (RF5 — activities per day)
All three require `?usuarioId=` and validate that the roteiro belongs to that user (403 otherwise).
| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | /api/roteiros/{id}/atividades?usuarioId= | - | List\<RoteiroAtividadeResponse\> | 200 |
| POST | /api/roteiros/{id}/atividades?usuarioId= | RoteiroAtividadeRequest | RoteiroAtividadeResponse | 201 |
| DELETE | /api/roteiros/{id}/atividades/{atividadeId}/dia/{diaNumero}?usuarioId= | - | - | 204 |

### Error Handling (GlobalExceptionHandler)
Two response shapes, both with a numeric `status`:
- **Validation errors** (`MethodArgumentNotValidException`) → `{ "status": 400, "errors": { "campo": "msg" } }`
- **Business/runtime errors** (`ResponseStatusException`) → `{ "status": 4xx, "message": "..." }`

The frontend reads `err.response.data.message` for business errors. **Keep the `message` key** —
changing it to `error` silently breaks every error toast.

---

## Development Conventions

### Git Workflow
- **Branches**: `feat/YGG-XX-desc`, `fix/YGG-XX-desc`, `refactor/YGG-XX-desc`, `docs/YGG-XX-desc`
- **Commits**: conventional commits + Jira key, e.g. `feat(roteiro): add activity per day YGG-35`
- **PRs**: always open a PR and get it reviewed — do not merge directly to `main`. Reference the
  Jira issue with `Closes YGG-XX`.

### Backend Code Style
- **DTOs**: always Java Records, validation annotations on constructor params
- **Entities**: Lombok `@Getter @Setter @NoArgsConstructor`; tags as `Set<String>` with `@ElementCollection`
- **Services**: constructor injection (no field `@Autowired`); use `ResponseStatusException` for errors;
  `@Transactional(readOnly = true)` for queries
- **Controllers**: `@RestController` + `@RequestMapping`; `@Valid` on request bodies; return `ResponseEntity`
- **Repositories**: extend `JpaRepository`; Spring Data method names; `@EntityGraph` to avoid N+1

### Frontend Code Style
- Functional components, default export, hooks
- Group API calls by feature in `services/api.ts`
- Use `EmptyState` for empty lists, `sonner` toasts for feedback
- `ProtectedRoute` guards authenticated pages
- User-facing strings: prefer Portuguese (the app is PT-first; some older screens still mix EN)

---

## Non-Obvious Patterns & Gotchas

### Backend
1. **Tags as ElementCollection**: `Usuario` and `Destino` use `Set<String>` with `@ElementCollection`
   (auto-creates `usuario_tags` / `destino_tags`). Don't create separate entities.
2. **BCryptPasswordEncoder**: singleton bean in `config/AppConfig`, injected via constructor.
3. **Entity→DTO mapping — uniform pattern**: every Response DTO exposes a `public static X from(Entity)`
   static factory (`DestinoResponse.from`, `RoteiroResponse.from`, `AtividadeResponse.from`,
   `RoteiroAtividadeResponse.from`). Services **never** build DTOs with `new` — always call `.from()`.
   The DTO importing the entity is an accepted trade-off for this project's size.
4. **`Roteiro.calcularTotalDias()`**: day count lives on the entity (rich domain model). It does not
   guard against null/inverted dates — `RoteiroService.criar()` validates the date order on input.
5. **RF5 ownership**: `RoteiroAtividadeService` validates that the roteiro belongs to the `usuarioId`
   before any add/remove/list. Endpoints take `usuarioId` as a query param.
6. **5-activities-per-day limit**: enforced in `RoteiroAtividadeService.validarLimitePorDia` (config:
   `roteiro.max-atividades-por-dia`, injected via constructor). `adicionar()` loads the roteiro with a
   `PESSIMISTIC_WRITE` lock (`findByIdForUpdate`), so concurrent inserts on the same roteiro serialise.
7. **Quiz is hardcoded**: `constant/QuizConstants` holds the 5 questions as a constant. Changing the
   quiz = code change.
8. **ResponseStatusException**: used everywhere instead of custom exception classes. Business
   validations live as private methods inside the services (not a separate validator layer).
9. **Constructor injection everywhere**: no field `@Autowired`, no `@Value` on fields — config values
   are constructor parameters annotated with `@Value`.

### Frontend
1. **API proxy**: `/api/*` is proxied by Vite to `:8080`. Never hardcode localhost.
2. **Zustand is mostly in-memory**: only `user` persists. Trip/diary data must be (re)fetched from
   the API on each page — `EditItinerary`, `ViewItinerary`, `DayPreview` hydrate from
   `roteiroApi.buscarPorId` + `roteiroAtividadeApi.listar`, not from the store.
3. **`useItineraryDays`**: builds the day array from a `Roteiro` API response (totalDias + dataIda),
   optionally overlaying activity IDs from the store.
4. **shadcn/ui**: components in `components/ui/` — regenerate, don't hand-edit.
5. **TypeScript strict mode is off** (`strict: false`) — type assertions like
   `as { atividadeId: number; diaNumero: number }[]` appear; prefer real types in `types/index.ts`.
6. **No global error boundary** — unhandled errors hit the console.

### Database
1. **DataSeeder runs once**: seeds destinos if the table is empty, then atividades if that table is
   empty. To re-seed, clear the relevant table(s).
2. **`ddl-auto=update`**: schema changes apply automatically in dev; use `validate` for prod.
3. **Port conflict**: the dev DB is on host port **5433** specifically to coexist with other local
   Postgres containers. Keep `docker-compose.yml` and `application.properties` in sync.

---

## Testing

### Backend (JUnit 5 + Mockito)
```bash
cd backend && ./mvnw test
```
Unit tests live in `src/test/java/.../` and mock repositories — no Spring context, no DB
(37 tests total):
- `AuthServiceTest` — cadastro (duplicate email) + login flows
- `DestinoServiceTest` — listar, listarSalvos, salvar (dup/new), remover
- `RoteiroServiceTest` — criar (date rules, not-found, happy path), buscar, deletar (ownership)
- `QuizServiceTest` — getPerguntas, salvarPerfil (not-found + tag replacement)
- `AtividadeServiceTest` — listarPorDestino with/without/blank turno filter
- `RoteiroAtividadeServiceTest` — ownership (403), 5/day limit, invalid day, duplicate, happy path
- `RoteiroTest` — `calcularTotalDias()` (inclusive day count, cross-month)

> Note: there is no `application.properties` under `src/test/resources`, so a full
> `@SpringBootTest` context test needs a reachable database. Prefer pure-Mockito unit tests.

### Frontend (Vitest + Playwright)
```bash
cd frontend && npm test
```

### Manual smoke test
Register → login → quiz → matches → create itinerary → edit (add/remove activities per day) →
view → day preview.

---

## Troubleshooting

### Backend won't start
- **`Port 8080 already in use`** → `lsof -i :8080`, kill the process, or change `server.port`.
- **`FATAL: password authentication failed`** / **`Unable to determine Dialect`** → usually a
  Postgres problem:
  - Another Postgres container owns the host port. `docker ps` — our config uses host port 5433;
    confirm with `docker inspect signaturetrips-db --format='{{json .NetworkSettings.Ports}}'`.
  - The `pgdata` volume was created with different credentials. Either
    `docker compose down -v && docker compose up -d` (drops data, re-seeds), or reset inline:
    `docker exec signaturetrips-db psql -U signaturetrips -d signaturetrips -c "ALTER USER signaturetrips PASSWORD 'signaturetrips';"`
  - `application.properties` credentials must be `signaturetrips/signaturetrips` and the URL must
    point at port **5433**.

### Frontend won't load
- **`Vite proxy /api returns 502`** → backend not running on 8080.
- **`"Itinerary not found"` on the edit screen** → the page should hydrate from the API; if it
  only checks the Zustand store it will fail after a reload (this was a known bug — fixed).

---

## Contact & Team
- **Organization**: ENG-SOFT-SMART-TOUR
- **Jira project key**: YGG

Last updated: May 2026 (Sprint 3 — backend SOLID uniformization: static `from()` factories on all
Response DTOs, constructor injection for config, CORS externalized, `data/` → `constant/`, unit
tests for all services. Earlier in the sprint — post-merge fixes: DB port 5433 + credentials, RF5 ownership
checks, unified error-response key, EditItinerary API hydration; unit tests added).
