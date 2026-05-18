# Architecture Documentation

DevMarket employs a modern, microservices-inspired monolithic architecture built on Next.js 15 (App Router). This document details the high-level system design.

## 1. System Architecture

```mermaid
graph TD
    Client[Client Browser] -->|HTTPS Request| Nginx[Nginx Reverse Proxy]
    
    subgraph Docker Cluster
        Nginx -->|Port 3000| NextApp[Next.js Application Container]
        
        subgraph Application Layer
            NextApp --> Auth[NextAuth.js]
            NextApp --> API[Next.js Route Handlers]
            NextApp --> RSC[React Server Components]
        end
        
        subgraph Data Layer
            API --> Prisma[Prisma ORM]
            RSC --> Prisma
        end
        
        Prisma -->|TCP 5432| DB[(PostgreSQL 15)]
    end
    
    NextApp -.->|Telemetry| Prometheus[Prometheus / Grafana]
    Auth -.->|OAuth| GitHub((GitHub Auth))
```

## 2. Request Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Nginx
    participant NextJS
    participant Prisma
    participant DB
    
    User->>Nginx: GET /dashboard
    Nginx->>NextJS: Forward Request
    NextJS->>NextJS: Middleware validates Session Token
    alt Invalid Session
        NextJS-->>User: 302 Redirect to /login
    else Valid Session
        NextJS->>Prisma: fetchUserProfile(userId)
        Prisma->>DB: SELECT * FROM User
        DB-->>Prisma: Return User Record
        Prisma-->>NextJS: Parse to Object
        NextJS->>NextJS: Render Server Components (RSC)
        NextJS-->>Nginx: HTML + Hydration Data
        Nginx-->>User: 200 OK (Rendered UI)
    end
```

## 3. Database Flow

The Data Layer strictly enforces relational integrity.

```mermaid
erDiagram
    USER ||--o{ COLLECTION : owns
    USER ||--o{ BOOKMARK : creates
    COLLECTION ||--o{ COLLECTION_ITEM : contains

    USER {
        String id PK
        String email
        String name
    }
    COLLECTION {
        String id PK
        String userId FK
        String title
    }
    BOOKMARK {
        String id PK
        String userId FK
        String type
    }
```

## 4. Scaling Considerations
- **Stateless Application**: Next.js is stateless, allowing horizontal scaling via Docker Swarm or Kubernetes.
- **Connection Pooling**: Prisma requires external connection pooling (like PgBouncer) for massive concurrency.
- **Edge Computing**: Middleware handles auth verification at the Edge to reduce origin server load.
