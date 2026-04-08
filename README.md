# SignatureTrips

Aplicativo de recomendação de viagens personalizado. O usuário se cadastra, responde um quiz de preferências de viagem, e recebe destinos recomendados com percentual de compatibilidade baseado no seu perfil.

---

## Stack Tecnológica

| Camada         | Tecnologia                      |
| -------------- | ------------------------------- |
| Frontend       | React 19.2 + TypeScript 6.0 + Vite 8.0 |
| Backend        | Spring Boot 4.0.5 + Java 21             |
| ORM            | Hibernate / Spring Data JPA             |
| Banco de Dados | PostgreSQL 16 (Docker)                  |
| Segurança      | BCrypt (spring-security-crypto)         |
| HTTP Client    | Axios                                   |
| Roteamento     | React Router DOM 7                      |

---

## Estrutura do Projeto

```
trips-signature/
├── backend/              # Spring Boot (Java 21, Maven)
│   ├── pom.xml
│   └── src/main/java/com/signaturetrips/api/
│       ├── config/       # CorsConfig
│       ├── controller/   # REST Controllers
│       ├── domain/
│       │   ├── entity/   # JPA Entities
│       │   └── repository/ # Spring Data Repositories
│       ├── dto/          # Records (Request/Response)
│       └── service/      # Business Logic
├── frontend/             # React 19 + TypeScript (Vite 8)
│   ├── package.json
│   └── src/
│       ├── pages/        # Route Components
│       ├── components/   # UI Components
│       ├── services/     # API Client
│       ├── store/        # State Management
│       └── types/        # TypeScript Interfaces
├── docker-compose.yml    # PostgreSQL 16
└── README.md
```

---

## Arquitetura

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React)"]
        Pages["Pages\nLogin | Quiz | Destinos"] --> Store["Store\nZustand"]
        Pages <--> api["services/api.ts\nAxios"]
    end

    subgraph Backend["Backend (Spring Boot)"]
        subgraph Config["config/"]
            CorsConfig
        end
        subgraph Controllers["controller/"]
            AuthCtrl["AuthController"]
            QuizCtrl["QuizController"]
        end
        subgraph Services["service/"]
            AuthSvc["AuthService"]
            QuizSvc["QuizService"]
        end
        subgraph Domain["domain/"]
            Entities["entity/\nUsuario | Destino"]
            Repos["repository/\nUsuarioRepository | DestinoRepository"]
        end
        subgraph DTOs["dto/"]
            Records["Records\nRequests | Responses"]
        end
    end

    api -- "HTTP/JSON :8080" --> Controllers
    Controllers --> DTOs
    Controllers --> Services
    Services --> Repos
    Repos --> Entities
    Entities --> DB[(PostgreSQL)]
```

---

## Diagrama ER

```mermaid
erDiagram
    usuarios {
        bigint id PK
        varchar nome
        varchar email "UNIQUE"
        varchar senha
        boolean quiz_completo
    }

    destinos {
        bigint id PK
        varchar nome
        text descricao
        varchar foto
        varchar pais
        varchar categoria
    }

    destinos_salvos {
        bigint id PK
        bigint usuario_id FK
        bigint destino_id FK
    }

    usuario_tags {
        bigint usuario_id FK
        varchar tag
    }

    destino_tags {
        bigint destino_id FK
        varchar tag
    }

    usuarios ||--o{ destinos_salvos : "salva"
    destinos ||--o{ destinos_salvos : "salvo em"
    usuarios ||--o{ usuario_tags : "possui"
    destinos ||--o{ destino_tags : "possui"
```

> `usuario_tags` e `destino_tags` são tabelas auxiliares geradas automaticamente pelo `@ElementCollection` do JPA.

---

## Diagrama de Classes — Backend

```mermaid
classDiagram
    namespace config {
        class CorsConfig {
            +addCorsMappings(CorsRegistry) void
        }
    }

    namespace controller {
        class AuthController {
            +cadastro(CadastroRequest) LoginResponse
            +login(LoginRequest) LoginResponse
        }
        class QuizController {
            +getPerguntas() List~PerguntaDto~
            +responder(QuizRequest) void
        }
    }

    namespace service {
        class AuthService {
            +cadastrar(CadastroRequest) LoginResponse
            +login(LoginRequest) LoginResponse
            -encoder BCryptPasswordEncoder
        }
        class QuizService {
            +getPerguntas() List~PerguntaDto~
            +salvarPerfil(QuizRequest) void
            -PERGUNTAS List~PerguntaDto~
        }
    }

    namespace domain_entity {
        class Usuario {
            +Long id
            +String nome
            +String email
            +String senha
            +Set~String~ tags
            +boolean quizCompleto
        }
        class Destino {
            +Long id
            +String nome
            +String descricao
            +String foto
            +String pais
            +String categoria
            +Set~String~ tags
        }
        class DestinoSalvo {
            +Long id
            +Usuario usuario
            +Destino destino
        }
    }

    namespace domain_repository {
        class UsuarioRepository {
            +findByEmail(email) Optional~Usuario~
            +existsByEmail(email) boolean
        }
        class DestinoRepository
        class DestinoSalvoRepository {
            +findByUsuario(usuario) List~DestinoSalvo~
            +existsByUsuarioAndDestino(u, d) boolean
            +findByUsuarioAndDestino(u, d) Optional~DestinoSalvo~
        }
    }

    namespace dto {
        class CadastroRequest {
            <<record>>
            +String nome
            +String email
            +String senha
        }
        class LoginRequest {
            <<record>>
            +String email
            +String senha
        }
        class LoginResponse {
            <<record>>
            +Long id
            +String nome
            +String email
            +boolean quizCompleto
        }
        class PerguntaDto {
            <<record>>
            +int id
            +String texto
            +List~OpcaoDto~ opcoes
        }
        class OpcaoDto {
            <<record>>
            +String label
            +String tag
        }
        class QuizRequest {
            <<record>>
            +Long usuarioId
            +List~String~ tags
        }
    }

    AuthController --> AuthService
    QuizController --> QuizService

    AuthService --> UsuarioRepository
    QuizService --> UsuarioRepository

    UsuarioRepository --> Usuario
    DestinoRepository --> Destino
    DestinoSalvoRepository --> DestinoSalvo

    DestinoSalvo --> Usuario
    DestinoSalvo --> Destino

    AuthController ..> CadastroRequest
    AuthController ..> LoginRequest
    AuthController ..> LoginResponse
    QuizController ..> PerguntaDto
    QuizController ..> QuizRequest
```

---

## Diagrama de Classes — Frontend

```mermaid
classDiagram
    class App {
        +BrowserRouter
        +ProtectedRoute
    }
    class AuthContext {
        +usuario Usuario
        +loginUser(usuario) void
        +logoutUser() void
    }
    class Login {
        +handleSubmit() void
    }
    class Cadastro {
        +handleSubmit() void
    }
    class Quiz {
        +perguntas Pergunta[]
        +respostas string[]
        +etapaAtual number
        +handleResposta(tag) void
        +handleSubmit() void
    }
    class Destinos {
        +destinos Destino[]
        +handleSalvar(id) void
        +handleLogout() void
    }
    class ApiService {
        +cadastrar(data) Promise
        +login(data) Promise
        +getPerguntas() Promise
        +responderQuiz(data) Promise
        +getDestinos(usuarioId) Promise
        +salvarDestino(uId, dId) Promise
        +removerDestino(uId, dId) Promise
    }

    App --> Login
    App --> Cadastro
    App --> Quiz
    App --> Destinos
    App --> AuthContext

    Login --> ApiService
    Cadastro --> ApiService
    Quiz --> ApiService
    Destinos --> ApiService

    Login --> AuthContext
    Cadastro --> AuthContext
    Quiz --> AuthContext
    Destinos --> AuthContext
```

---

## Fluxo do Usuário

```mermaid
flowchart LR
    A([Cadastro]) --> B([Quiz\n5 perguntas])
    B --> C([Perfil gerado\ntags])
    C --> D([Destinos\nordenados por % match])
    D --> E([Salvar\nfavoritos])
```
