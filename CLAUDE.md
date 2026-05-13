# SignatureTrips - Claude Development Guide

**Project**: SignatureTrips - Personalized Travel Recommendation App
**Stack**: React 19 + TypeScript + Spring Boot 4.0.5 + PostgreSQL 16
**Repo**: https://github.com/ENG-SOFT-SMART-TOUR/trips-signature
**Jira Board**: SM_SignatureTrips at signaturetrips.atlassian.net (project key: YGG)

---

## Quick Start

### Prerequisites
- Java 21 (backend)
- Node.js 18+ with npm (frontend)
- Docker & Docker Compose (PostgreSQL)
- Maven 3.9.14+ (included via ./mvnw wrapper)

### Launch Development Environment

```bash
# Terminal 1: Start PostgreSQL
docker compose up -d

# Terminal 2: Start backend (port 8080)
cd backend
./mvnw spring-boot:run

# Terminal 3: Start frontend (port 5173)
cd frontend
npm install
npm run dev
```

**Access**: Frontend at http://localhost:5173 (proxies /api to :8080)

---

## Database Setup

PostgreSQL 16 (Alpine) running via Docker:
- **Container**: signaturetrips-db
- **Host port**: 5433 (container internal: 5432). Host 5433 is used to avoid clashing with other local Postgres instances commonly bound to 5432.
- **JDBC URL**: `jdbc:postgresql://localhost:5433/signaturetrips`
- **Credentials**: user=signaturetrips, password=signaturetrips, db=signaturetrips
- **DDL**: Hibernate `ddl-auto=update` (auto-creates/updates tables)
- **Data**: DataSeeder populates 19 destinations on first startup (one-time)

### Database Schema
```
usuarios
├── id (PK, auto-increment)
├── nome (NOT NULL)
├── email (UNIQUE, NOT NULL)
├── senha (NOT NULL)
├── quiz_completo (default: false)
└── usuario_tags (ElementCollection -> bridge table)

destinos
├── id (PK, auto-increment)
├── nome (NOT NULL)
├── descricao (TEXT)
├── foto (image URL)
├── pais
├── categoria (stored as lowercase string; mapped to/from Categoria enum via JPA AttributeConverter)
└── destino_tags (ElementCollection -> bridge table)

destinos_salvos
├── id (PK)
├── usuario_id (FK -> usuarios)
└── destino_id (FK -> destinos)

roteiros
├── id (PK, auto-increment)
├── usuario_id (FK -> usuarios, indexed)
├── destino_id (FK -> destinos)
├── data_ida (LocalDate)
├── data_volta (LocalDate)
└── criado_em (LocalDateTime)
```

---

## Architecture

### Monorepo Structure
```
trips-signature/
├── backend/
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd (Maven Wrapper 3.9.14)
│   ├── .mvn/wrapper/maven-wrapper.properties
│   └── src/main/java/com/signaturetrips/api/
│       ├── SignatureTripsApplication.java (@SpringBootApplication)
│       ├── config/
│       │   ├── CorsConfig (origins/methods read from app.cors.* properties)
│       │   ├── DataSeeder (implements CommandLineRunner, seeds 19 destinos)
│       │   ├── GlobalExceptionHandler (handlers for validation, ResponseStatusException, DataIntegrityViolation, generic Exception)
│       │   └── SecurityConfig (exposes BCryptPasswordEncoder bean, factor 10)
│       ├── controller/
│       │   ├── AuthController (POST /api/auth/cadastro, /api/auth/login)
│       │   ├── DestinoController (GET /api/destinos, GET /api/destinos/salvos/{usuarioId}, POST/DELETE /api/destinos/{destinoId}/salvar/{usuarioId})
│       │   ├── QuizController (GET /api/quiz/perguntas, POST /api/quiz/responder)
│       │   └── RoteiroController (POST /api/roteiros, GET /api/roteiros/{id}, GET /api/roteiros/usuario/{usuarioId}, DELETE /api/roteiros/{id}/usuario/{usuarioId})
│       ├── service/
│       │   ├── AuthService (cadastro/login, BCryptPasswordEncoder injected as bean)
│       │   ├── DestinoService (listar/salvar/remover destinos, delegates DTO mapping)
│       │   ├── QuizService (5 hardcoded questions, delegates profile mutation to UsuarioProfileService)
│       │   ├── RoteiroService (CRUD de roteiros, delegates validation/calculation/mapping)
│       │   ├── UsuarioProfileService (tag replacement + quizCompleto flag)
│       │   ├── mapper/
│       │   │   ├── DestinoMapper (@Component, Destino -> DestinoResponse)
│       │   │   └── RoteiroMapper (@Component, uses DestinoMapper + RoteiroCalculator)
│       │   ├── validator/
│       │   │   └── RoteiroValidator (date range rules)
│       │   └── calculator/
│       │       └── RoteiroCalculator (inclusive totalDias)
│       ├── domain/
│       │   ├── entity/
│       │   │   ├── Usuario (@Entity, @Table, @Index on email)
│       │   │   ├── Destino (@Entity, categoria as Categoria enum via JPA Converter)
│       │   │   ├── DestinoSalvo (@Entity, unique constraint on usuario+destino)
│       │   │   └── Roteiro (@Entity, @Index on usuario_id)
│       │   ├── repository/
│       │   │   ├── UsuarioRepository (findByEmail, existsByEmail)
│       │   │   ├── DestinoRepository (JpaRepository)
│       │   │   ├── DestinoSalvoRepository (findByUsuario, existsByUsuarioAndDestino, findByUsuarioAndDestino)
│       │   │   └── RoteiroRepository (findByUsuarioOrderByCriadoEmDesc, findWithAssociacoesById via @EntityGraph)
│       │   └── enums/
│       │       ├── Categoria (BEACH, MOUNTAINS, CITY, COUNTRYSIDE, NATURE — fromValue/getValue)
│       │       └── CategoriaConverter (@Converter(autoApply=true), maps to/from lowercase string in DB)
│       ├── exception/
│       │   └── ErrorResponse (record, @JsonInclude NON_NULL — used by GlobalExceptionHandler)
│       └── dto/ (Java Records with Jakarta Validation)
│           ├── CadastroRequest (@NotBlank, @Email, @Size)
│           ├── LoginRequest (@NotBlank, @Email)
│           ├── LoginResponse (Long id, String nome, String email, boolean quizCompleto)
│           ├── DestinoResponse (id, nome, descricao, foto, pais, String categoria, Set~String~ tags)
│           ├── RoteiroRequest (@NotNull usuarioId/destinoId, @FutureOrPresent dataIda/dataVolta)
│           ├── RoteiroResponse (id, DestinoResponse destino, dataIda, dataVolta, int totalDias, criadoEm)
│           ├── PerguntaDto (int id, String texto, List~OpcaoDto~ opcoes)
│           ├── OpcaoDto (String label, String tag)
│           └── QuizRequest (@NotNull Long usuarioId, @NotEmpty List~String~ tags)
│
├── frontend/
│   ├── package.json (18.3.1 React, Vite 5, TypeScript 5.8)
│   ├── vite.config.ts (port 5173, /api proxy to localhost:8080)
│   ├── tsconfig.json / tsconfig.app.json
│   ├── tailwind.config.ts (darkMode: class)
│   ├── eslint.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx (createRoot, renders App)
│       ├── index.css (global styles)
│       ├── App.tsx (QueryClientProvider, BrowserRouter, Routes, ProtectedRoute)
│       ├── pages/
│       │   ├── Landing.tsx
│       │   ├── Register.tsx
│       │   ├── Login.tsx
│       │   ├── Quiz.tsx (5 questions, tags, answer tracking)
│       │   ├── Matches.tsx (destinations with match %)
│       │   ├── Dashboard.tsx
│       │   ├── Settings.tsx
│       │   ├── Itineraries.tsx
│       │   ├── NewItinerary.tsx
│       │   ├── EditItinerary.tsx
│       │   ├── ViewItinerary.tsx
│       │   ├── DayPreview.tsx
│       │   ├── ActivityDetail.tsx
│       │   ├── Diaries.tsx
│       │   ├── DiaryView.tsx
│       │   ├── NewDiaryEntry.tsx
│       │   ├── PublicDiary.tsx
│       │   ├── Admin.tsx
│       │   └── NotFound.tsx
│       ├── components/
│       │   └── ui/ (shadcn/ui - do NOT modify files in ui/)
│       ├── services/
│       │   └── api.ts (axios baseURL=/api, proxied in Vite)
│       ├── store/
│       │   └── useStore.ts (Zustand, localStorage persistence)
│       ├── types/
│       │   └── index.ts (Usuario, Opcao, Pergunta, Destino interfaces)
│       └── test/
│           └── example.test.ts (vitest skeleton)
│
└── docker-compose.yml (PostgreSQL 16 Alpine)
```

### Data Flow

```
Frontend (React + Zustand)
    ↓
Vite Proxy (/api → localhost:8080)
    ↓
Spring Boot REST Controllers
    ↓
Services (business logic)
    ↓
Repositories (JpaRepository)
    ↓
Hibernate ORM
    ↓
PostgreSQL 16
```

---

## Backend Build & Deployment

### Maven Commands
```bash
cd backend

# Development: Run with live reload
./mvnw spring-boot:run

# Build JAR (creates backend/target/backend-0.0.1-SNAPSHOT.jar)
./mvnw clean package

# Run tests
./mvnw test

# Skip tests during build
./mvnw clean package -DskipTests

# Clean build artifacts
./mvnw clean
```

### Key Dependencies
| Dependency | Version | Notes |
|------------|---------|-------|
| Spring Boot | 4.0.5 | Latest Spring 4.x (Java 21 compatible) |
| Spring Data JPA | - | From parent POM |
| Spring Validation | - | Jakarta Validation (not javax) |
| PostgreSQL Driver | - | JDBC connector |
| spring-security-crypto | - | BCryptPasswordEncoder |
| Lombok | - | @Getter @Setter @NoArgsConstructor (annotation processor) |
| Spring Tests | - | spring-boot-starter-*-test (scope: test) |

### Important Notes
- **Lombok**: Requires annotation processor configuration in pom.xml (already set up)
- **DDL**: `spring.jpa.hibernate.ddl-auto=update` in application.properties
- **SQL Logging**: `spring.jpa.show-sql=true` and `format_sql=true` for debugging
- **Port**: 8080 (configured in application.properties)
- **CORS**: Configured via `app.cors.allowed-origins` and `app.cors.allowed-methods` in application.properties (default: localhost:5173 / GET,POST,PUT,DELETE)
- **BCryptPasswordEncoder**: Exposed as singleton bean in `config/SecurityConfig`, injected by constructor where needed

---

## Frontend Build & Development

### npm Scripts
```bash
cd frontend

# Development: Hot reload at http://localhost:5173
npm run dev

# Production build (creates dist/ directory)
npm run build

# Build in development mode (unoptimized)
npm run build:dev

# Preview production build
npm run preview

# Run tests (Vitest, runs once)
npm test

# Run tests in watch mode
npm run test:watch

# Lint code (ESLint)
npm run lint
```

### Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.3.1 | UI framework |
| React Router | 6.30.1 | Client-side routing with ProtectedRoute |
| TypeScript | 5.8.3 | Type safety |
| Vite | 5.4.19 | Build tool, dev server (port 5173) |
| Zustand | 5.0.12 | State management with localStorage persistence |
| Axios | 1.15.0 | HTTP client (baseURL=/api, no hardcoded localhost) |
| Tailwind CSS | 3.4.17 | Utility-first CSS (darkMode: class) |
| shadcn/ui | - | Radix UI + Tailwind components |
| Framer Motion | 12.38.0 | Page transitions & animations |
| sonner | 1.7.4 | Toast notifications |
| React Query | 5.83.0 | Server state management |
| Zod | 3.25.76 | Schema validation |
| React Hook Form | 7.61.1 | Form state management |
| Vitest | 3.2.4 | Test runner (Vite-native) |
| @playwright/test | 1.57.0 | E2E testing framework |
| ESLint | 9.32.0 | Linting (React Hooks + Refresh plugins) |

### Important Notes
- **Path Alias**: `@/*` → `./src/*` (configured in vite.config.ts & tsconfig.json)
- **API Proxy**: `/api/*` → `http://localhost:8080` (Vite server.proxy)
- **Styling**: Tailwind with custom colors, animations, Radix UI integration
- **TypeScript**: `strict: false` (relaxed for faster development)
- **Tests**: Use Vitest + @testing-library/react + Playwright for E2E
- **dark mode**: `<html class="dark">` applies dark theme

---

## Development Conventions

### Git Workflow
**Branch naming**:
```
feat/YGG-XX-short-description
fix/YGG-XX-short-description
docs/YGG-XX-short-description
refactor/YGG-XX-short-description
```

**Commits** (conventional commits with Jira key):
```
feat(auth): implement login endpoint YGG-7
fix(quiz): correct tag validation logic YGG-12
docs(readme): update setup instructions
refactor(api): extract common error handling YGG-15
```

**Pull Requests**:
- User creates all commits and PRs
- Claude only writes code (no git operations)
- Reference Jira issue in PR description: "Closes YGG-XX"

### Backend Code Style

#### DTOs (Java Records)
```java
public record LoginRequest(
    @NotBlank @Email String email,
    @NotBlank String senha
) {}
```
- Always use Records, never classes
- Validation annotations on constructor params: @NotBlank, @Email, @Size, @NotEmpty, @NotNull
- Package: `com.signaturetrips.api.dto`

#### Entities (Lombok + JPA)
```java
@Entity
@Table(name = "usuarios", indexes = @Index(name = "idx_usuario_email", columnList = "email"))
@Getter
@Setter
@NoArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    @ElementCollection
    @CollectionTable(name = "usuario_tags", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();
}
```
- Use Lombok annotations: @Getter, @Setter, @NoArgsConstructor
- Tags stored as Set<String> with @ElementCollection (auto-creates bridge table)
- Add @Index for frequently queried columns (e.g., email)

#### Services
```java
@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder encoder;

    public AuthService(UsuarioRepository usuarioRepository, BCryptPasswordEncoder encoder) {
        this.usuarioRepository = usuarioRepository;
        this.encoder = encoder;
    }

    public LoginResponse cadastrar(CadastroRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }
        // ... logic
    }
}
```
- Constructor injection (no @Autowired)
- Use ResponseStatusException for errors (not custom exception classes)
- Cross-cutting helpers (mappers, validators, calculators, profile updates) live in their own `@Component` classes under `service/mapper/`, `service/validator/`, `service/calculator/`, and are injected via constructor — the service stays focused on orchestration (SRP)
- @Transactional(readOnly = true) for queries

#### Controllers
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<LoginResponse> cadastrar(@Valid @RequestBody CadastroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.cadastrar(request));
    }
}
```
- @RestController + @RequestMapping on class
- Constructor injection for services
- @Valid on request body to trigger validation
- Return ResponseEntity with appropriate HTTP status

#### Repositories
```java
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
}
```
- Extend JpaRepository<Entity, IdType>
- Custom query methods use Spring Data naming conventions
- No @Query annotations needed for simple queries

### Frontend Code Style

#### Components (React + TypeScript)
```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
```
- Functional components with hooks
- Named exports as default
- TypeScript for all props and state
- Use shadcn/ui components (Button, Input, Dialog, etc.)

#### API Calls (Axios)
```typescript
// services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const authApi = {
  cadastrar: (data: { nome: string; email: string; senha: string }) =>
    api.post("/auth/cadastro", data),

  login: (data: { email: string; senha: string }) =>
    api.post("/auth/login", data),
};
```
- baseURL="/api" (proxied in Vite, no hardcoded localhost:8080)
- Group endpoints by feature (authApi, quizApi, etc.)
- Use TypeScript for request/response types

#### State Management (Zustand)
```typescript
import { create } from "zustand";

interface AppState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, name: string, id: number) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (email, name, id, quizCompleto) => {
    const user = { id, name, email, quizCompleto, tags: [] };
    localStorage.setItem("user", JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ isAuthenticated: false, user: null });
  },
}));
```
- Single store with typed state
- Persist user data to localStorage
- Methods update state immutably
- Import: `const { user, logout } = useStore(s => ({ user: s.user, logout: s.logout }))`
  OR `const logout = useStore(s => s.logout)` (common pattern)

#### Routing (React Router)
```typescript
// App.tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
```
- ProtectedRoute wraps pages requiring authentication
- Redirect to /login if not authenticated
- Use Framer Motion's AnimatePresence for page transitions

#### Testing
```typescript
// Vitest
import { describe, it, expect } from "vitest";

describe("auth", () => {
  it("should login user", () => {
    expect(user.email).toBe("test@example.com");
  });
});

// Playwright (E2E)
import { test, expect } from "@playwright/test";

test("login flow", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.fill("input[type='email']", "test@example.com");
  await page.click("button[type='submit']");
  await expect(page).toHaveURL("**/quiz");
});
```

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
| GET | /api/quiz/perguntas | - | List<PerguntaDto> | 200 |
| POST | /api/quiz/responder | QuizRequest | - | 200 |

### Destinos
| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| GET | /api/destinos | - | List<DestinoResponse> | 200 |
| GET | /api/destinos/salvos/{usuarioId} | - | List<DestinoResponse> | 200 |
| POST | /api/destinos/{destinoId}/salvar/{usuarioId} | - | - | 200 |
| DELETE | /api/destinos/{destinoId}/salvar/{usuarioId} | - | - | 200 |

### Roteiros
| Method | Endpoint | Request | Response | Status |
|--------|----------|---------|----------|--------|
| POST | /api/roteiros | RoteiroRequest | RoteiroResponse | 201 |
| GET | /api/roteiros/{id} | - | RoteiroResponse | 200 |
| GET | /api/roteiros/usuario/{usuarioId} | - | List<RoteiroResponse> | 200 |
| DELETE | /api/roteiros/{id}/usuario/{usuarioId} | - | - | 204 |

### Error Handling
- **400 Bad Request**: Validation errors (GlobalExceptionHandler returns `{status, errors: {field: msg}}`)
- **400 Bad Request**: Business rule violations (e.g. `dataVolta <= dataIda`) return `{status, message}`
- **401 Unauthorized**: Invalid credentials
- **404 Not Found**: User/destination/roteiro not found
- **409 Conflict**: Email already registered, DB constraint violations
- **500 Internal Server Error**: Unhandled exceptions (generic `{status, message: "Erro interno do servidor"}`)

Example validation error (unchanged shape, kept for frontend compatibility):
```json
{
  "status": 400,
  "errors": {
    "email": "must be a well-formed email address",
    "senha": "size must be between 6 and 2147483647"
  }
}
```

Example business/runtime error (post-refactor shape):
```json
{
  "status": 401,
  "message": "Credenciais inválidas"
}
```

---

## Testing Strategy

### Unit Tests (Vitest)
```bash
npm test
npm run test:watch
```
- Test utilities, hooks, state mutations
- Use @testing-library/react for component testing
- File pattern: `**/*.test.ts` or `**/*.spec.ts`

### Integration Tests (Postman / Manual)
- Test API endpoints with various request/response payloads
- Verify error handling and edge cases

### E2E Tests (Playwright)
```bash
# Playwright tests are included in package.json but not yet configured
# To set up: npx playwright install && npx playwright test
```
- Full user flows: Register → Quiz → Matches

### Manual Testing (Browser)
1. Register at `/register`
2. Login at `/login`
3. Take quiz at `/quiz`
4. View matches at `/matches`
5. Logout via Settings or Dashboard

---

## Non-Obvious Patterns & Gotchas

### Backend
1. **Tags as ElementCollection**: Usuario and Destino use `Set<String>` with `@ElementCollection`. JPA auto-creates bridge tables (`usuario_tags`, `destino_tags`). Don't create separate entities.
2. **Password Hashing**: `BCryptPasswordEncoder(10)` is a singleton bean in `config/SecurityConfig`, injected into AuthService via constructor. Mockable for tests, no per-request allocation.
3. **ResponseStatusException**: Used instead of custom exception classes. The `GlobalExceptionHandler` (in `config/`) covers validation, `ResponseStatusException`, `DataIntegrityViolationException`, and a generic fallback, all serialising through `exception/ErrorResponse`. Validation responses keep the original `{status, errors: {field: msg}}` shape; other errors serialise as `{status, message}` (nulls omitted via `@JsonInclude NON_NULL`).
4. **Categoria enum + Converter**: `domain/enums/Categoria` is the type-safe enum (BEACH, MOUNTAINS, CITY, COUNTRYSIDE, NATURE). `CategoriaConverter` (autoApply) maps to/from the lowercase string already in the DB so the JSON contract for `DestinoResponse.categoria` (lowercase String) is preserved. Add new categories by extending the enum and updating DataSeeder.
5. **CORS**: Driven by `app.cors.allowed-origins` / `app.cors.allowed-methods` in application.properties (comma-separated). Add the production origin via env var or property override — no code change needed.
6. **Quiz is Hardcoded**: QuizService has 5 hardcoded PerguntaDto objects. No database queries. Profile mutation (tag replacement + `quizCompleto` flag) is delegated to `UsuarioProfileService`.
7. **DTO mapping is a Component**: `service/mapper/DestinoMapper` and `service/mapper/RoteiroMapper` own entity → response conversion. Services never build DTOs by hand. RoteiroMapper composes `DestinoMapper` and `RoteiroCalculator`.
8. **Date validation/calculation are Components**: `service/validator/RoteiroValidator` enforces `dataVolta > dataIda`. `service/calculator/RoteiroCalculator` computes inclusive `totalDias`. Both are simple stateless `@Component`s, trivially unit-testable.
9. **No JWT/Sessions**: Currently stateless (no user session tracking). Each request validates email+password independently. User ID and state stored in frontend localStorage only.

### Frontend
1. **API Proxy**: `/api/*` is proxied in Vite to `http://localhost:8080`. Never hardcode localhost in API calls.
2. **ProtectedRoute with Zustand**: Auth state is read from localStorage on page reload. useStore is initialized with saved user data.
3. **No Global Error Boundary**: Currently no error boundary component. Errors throw to console. Consider adding for production.
4. **Framer Motion AnimatePresence**: Wrapped around Routes for page transition animations. Requires `mode="wait"` to prevent layout jumps.
5. **shadcn/ui Components**: Located in `components/ui/`. Do NOT modify these files directly—regenerate via `npx shadcn-ui@latest add <component>` if needed.
6. **Zustand Persistence**: User data stored in localStorage. No server-side session. Logout clears localStorage.
7. **TypeScript Strict Mode Off**: `strict: false` in tsconfig.app.json to speed up development. Warnings are safe to ignore for now.

### Database
1. **Auto-Increment IDs**: Both usuarios and destinos use `@GeneratedValue(strategy = GenerationType.IDENTITY)`. PostgreSQL sequences auto-created.
2. **DataSeeder Runs Once**: Checks `if (destinoRepository.count() > 0)` before seeding. Delete data to re-seed on restart.
3. **Email Index**: `Usuario` has a named index on email for login query optimization.
4. **Cascade Deletes**: DestinoSalvo (future feature) should cascade delete when usuario/destino deleted. Not yet implemented.

---

## Deployment Checklist

- [ ] Verify backend builds: `./mvnw clean package`
- [ ] Verify frontend builds: `npm run build` (creates `dist/` directory)
- [ ] Update CorsConfig to allow production frontend URL
- [ ] Set production database URL in application.properties
- [ ] Run database migrations (Hibernate ddl-auto=validate)
- [ ] Test API endpoints with Postman
- [ ] Update environment variables (no .env files in git)
- [ ] Deploy backend JAR to application server
- [ ] Deploy frontend dist/ to CDN or static hosting
- [ ] Configure reverse proxy (nginx/Apache) for /api routing

---

## File Locations Quick Reference

| File | Purpose |
|------|---------|
| `backend/pom.xml` | Maven dependencies, plugins, Java version |
| `backend/src/main/resources/application.properties` | Spring config (DB, port, JPA) |
| `backend/src/main/java/com/signaturetrips/api/SignatureTripsApplication.java` | Spring Boot entry point |
| `backend/src/main/java/com/signaturetrips/api/config/CorsConfig.java` | CORS policy (localhost:5173) |
| `backend/src/main/java/com/signaturetrips/api/config/DataSeeder.java` | Populates 19 destinations |
| `backend/src/main/java/com/signaturetrips/api/service/AuthService.java` | Register/login logic |
| `backend/src/main/java/com/signaturetrips/api/service/QuizService.java` | 5 hardcoded quiz questions |
| `frontend/package.json` | npm dependencies, scripts |
| `frontend/vite.config.ts` | Vite config, /api proxy |
| `frontend/src/App.tsx` | Routes, ProtectedRoute, QueryClient |
| `frontend/src/store/useStore.ts` | Zustand state (auth, user, destinations) |
| `frontend/src/services/api.ts` | Axios client (baseURL=/api) |
| `frontend/src/types/index.ts` | TypeScript interfaces (Usuario, Destino, etc.) |
| `frontend/tailwind.config.ts` | Tailwind CSS theme, animations |
| `docker-compose.yml` | PostgreSQL 16 service definition |

---

## Useful Commands

### Backend
```bash
cd backend
./mvnw spring-boot:run           # Dev: hot reload
./mvnw clean package             # Build JAR
./mvnw clean package -DskipTests # Build without tests
./mvnw test                       # Run tests
```

### Frontend
```bash
cd frontend
npm install                # Install dependencies
npm run dev               # Dev server (hot reload)
npm run build             # Production build
npm run preview           # Preview prod build
npm test                  # Run tests
npm run lint              # Check code style
```

### Docker
```bash
docker compose up -d      # Start PostgreSQL
docker compose down       # Stop PostgreSQL
docker compose logs -f    # Follow logs
```

### Git
```bash
git checkout -b feat/YGG-XX-description
git add .
git commit -m "feat(scope): message YGG-XX"
git push -u origin feat/YGG-XX-description
```

---

## Troubleshooting

### Backend Won't Start
- **Error**: `Port 8080 already in use`
  - Solution: `lsof -i :8080` and kill process, or change port in application.properties
- **Error**: `FATAL: password authentication failed for user "signaturetrips"` (often paired with `Unable to determine Dialect`)
  - Most common cause: another Postgres container is already bound to your host port (e.g. another project on 5432). Run `docker ps` — if you see a second postgres container holding the port, our config is already on 5433 to avoid this. Confirm `docker inspect signaturetrips-db --format='{{json .NetworkSettings.Ports}}'` shows `0.0.0.0:5433`.
  - If the port mapping is fine but auth still fails, the `pgdata` volume was initialised with a different password in a previous run. Either `docker compose down -v && docker compose up -d` (loses data, DataSeeder reseeds), or reset inline: `docker exec signaturetrips-db psql -U signaturetrips -d signaturetrips -c "ALTER USER signaturetrips PASSWORD 'signaturetrips';"`.
- **Error**: `Hibernate table creation failed`
  - Solution: Check ddl-auto setting. Use `update` for dev, `validate` for prod.

### Frontend Won't Load
- **Error**: `Cannot find module '@/components/ui/button'`
  - Solution: Install shadcn/ui components: `npx shadcn-ui@latest add button`
- **Error**: `Vite proxy /api returns 502`
  - Solution: Ensure backend is running on port 8080. Check vite.config.ts target URL.
- **Error**: `"isAuthenticated is undefined"`
  - Solution: useStore may not be initialized. Check localStorage has 'user' key after login.

### Tests Failing
- **Vitest not found**: `npm install` first, then `npm test`
- **Playwright timeout**: Ensure frontend dev server running on 5173

---

## Additional Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com
- **Vite Docs**: https://vitejs.dev
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Jira Board**: https://signaturetrips.atlassian.net

---

## Contact & Team

- **Organization**: ENG-SOFT-SMART-TOUR
- **Project Manager**: Jira key YGG
- **Frontend Lead**: (Update as needed)
- **Backend Lead**: (Update as needed)

Last updated: May 2026 (Sprint 3 — backend SOLID refactor: BCryptPasswordEncoder bean, mapper/validator/calculator components, Categoria enum + Converter, expanded GlobalExceptionHandler, CORS via properties, Postgres on host port 5433, unit tests added).
