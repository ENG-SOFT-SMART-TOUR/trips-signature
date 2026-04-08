# SmartTour

Plataforma de tours virtuais com realidade aumentada. O usuário se cadastra, responde um quiz de preferências de viagem, e recebe destinos recomendados com percentual de compatibilidade baseado no seu perfil.

---

## Stack Tecnológica

| Camada         | Tecnologia                      |
| -------------- | ------------------------------- |
| Frontend       | React 19 + TypeScript + Vite 8  |
| Backend        | Spring Boot 4.0.5 + Java 21     |
| ORM            | Hibernate 7 / Spring Data JPA   |
| Banco de Dados | PostgreSQL 16 (Docker)          |
| Segurança      | BCrypt (spring-security-crypto) |
| HTTP Client    | Axios                           |
| Roteamento     | React Router DOM 7              |

---

## Estrutura do Projeto

```
tour_smart/
├── frontend/          # React + TypeScript (Vite)
├── backend/           # Spring Boot (Java 21, Maven)
├── docker-compose.yml # PostgreSQL 16
├── README.md
└── REQUIREMENTS.md    # User stories e requisitos do projeto
```

---

## Arquitetura

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React)"]
        Login --> Quiz --> Destinos
        AuthContext("AuthContext\nlocalStorage") <--> api("api.ts\nAxios")
    end

    subgraph Backend["Backend (Spring Boot)"]
        Controller --> Service --> Repository --> DB[(PostgreSQL)]
    end

    api -- "HTTP/JSON :8080" --> Controller
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
    class AuthController {
        +cadastro(CadastroRequest) LoginResponse
        +login(LoginRequest) LoginResponse
    }
    class QuizController {
        +getPerguntas() List~QuizPergunta~
        +responder(QuizRequest) void
    }
    class DestinoController {
        +listar(usuarioId) List~DestinoResponse~
        +salvar(usuarioId, destinoId) void
        +remover(usuarioId, destinoId) void
    }

    class AuthService {
        +cadastrar(CadastroRequest) LoginResponse
        +login(LoginRequest) LoginResponse
        -passwordEncoder BCryptPasswordEncoder
    }
    class QuizService {
        +getPerguntas() List~QuizPergunta~
        +processarQuiz(QuizRequest) void
        -PERGUNTAS List~QuizPergunta~
    }
    class DestinoService {
        +listarComMatch(usuarioId) List~DestinoResponse~
        +salvarDestino(usuarioId, destinoId) void
        +removerDestino(usuarioId, destinoId) void
        -calcularMatch(userTags, destinoTags) int
        +popularDestinos() void
    }

    class UsuarioRepository {
        +findByEmail(email) Optional~Usuario~
    }
    class DestinoRepository
    class DestinoSalvoRepository {
        +findByUsuario(usuario) List~DestinoSalvo~
        +existsByUsuarioAndDestino(u, d) boolean
        +findByUsuarioAndDestino(u, d) Optional~DestinoSalvo~
    }

    class Usuario {
        +Long id
        +String nome
        +String email
        +String senha
        +List~String~ tags
        +boolean quizCompleto
    }
    class Destino {
        +Long id
        +String nome
        +String descricao
        +String foto
        +String categoria
        +List~String~ tags
    }
    class DestinoSalvo {
        +Long id
        +Usuario usuario
        +Destino destino
    }

    AuthController --> AuthService
    QuizController --> QuizService
    DestinoController --> DestinoService

    AuthService --> UsuarioRepository
    QuizService --> UsuarioRepository
    DestinoService --> UsuarioRepository
    DestinoService --> DestinoRepository
    DestinoService --> DestinoSalvoRepository

    UsuarioRepository --> Usuario
    DestinoRepository --> Destino
    DestinoSalvoRepository --> DestinoSalvo

    DestinoSalvo --> Usuario
    DestinoSalvo --> Destino
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
