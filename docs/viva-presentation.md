# DevMarket Final Viva Presentation Package

This document outlines the final 15-slide presentation structure, including key speaking points, designed for an academic viva or stakeholder review.

---

## Slide 1: Title Slide
- **Title**: DevMarket — Enterprise Developer Ecosystem
- **Subtitle**: Unifying API Discovery, Tooling, and Architecture
- **Speaking Points**: "Welcome. Today I will present DevMarket, a full-stack, DevOps-hardened platform designed to eliminate workflow fragmentation for developers by providing a unified hub for APIs, tools, and news."

## Slide 2: The Problem
- **Content**: Context switching, fragmented tooling (Postman vs browser), unorganized resources.
- **Speaking Points**: "Developers waste hours switching between Postman, random online formatters, and news aggregators. DevMarket centralizes these into one high-performance platform."

## Slide 3: The Solution
- **Content**: Dashboard screenshot highlighting API Playground, Command Palette (`⌘K`), and Collections.
- **Speaking Points**: "Our solution is a single-pane-of-glass application. You can test APIs natively, format JSON securely, and organize your favorite tools into custom collections."

## Slide 4: Technology Stack
- **Content**: Grid of Logos (Next.js 15, React 19, PostgreSQL, Docker, Jenkins, Terraform).
- **Speaking Points**: "We chose an enterprise-ready stack. Next.js App Router for server-rendered performance, PostgreSQL for relational data integrity, and a complete Dockerized DevOps pipeline for immutable deployments."

## Slide 5: System Architecture
- **Content**: Mermaid System Architecture Diagram (Nginx -> Next.js -> Prisma -> DB).
- **Speaking Points**: "Here is our microservices-inspired architecture. Nginx acts as our reverse proxy, distributing traffic to our Next.js container, which interfaces with PostgreSQL via Prisma ORM."

## Slide 6: Database & Data Modeling
- **Content**: ER Diagram (User, Collection, Bookmark).
- **Speaking Points**: "Our data layer enforces strict relational integrity. Users can own collections and bookmarks, and we utilize Prisma to handle cascading deletes and type-safe migrations."

## Slide 7: Security & Authentication
- **Content**: OAuth Flow Diagram.
- **Speaking Points**: "Security is paramount. We implemented NextAuth.js for stateless JWT sessions using GitHub OAuth. Edge middleware protects private routes like `/dashboard` before rendering occurs."

## Slide 8: The API Playground Architecture
- **Content**: Explanation of the Server-Side Proxy.
- **Speaking Points**: "A major technical achievement is the API Playground. To bypass browser CORS errors, we built a Next.js proxy route that safely executes external API calls from our server and returns the timing metrics to the client."

## Slide 9: Infrastructure as Code (Terraform)
- **Content**: Diagram of AWS VPC, EC2, and Subnets.
- **Speaking Points**: "Our infrastructure is entirely codified using Terraform. We simulate provisioning an AWS VPC with secure subnets and an EC2 instance, allowing us to spin up the entire production environment in minutes."

## Slide 10: Docker & Container Orchestration
- **Content**: Docker Network Diagram showing isolated containers.
- **Speaking Points**: "The application runs in isolated Docker containers. Our `docker-compose` setup binds Nginx, the Next.js app, and PostgreSQL into a private network, with persistent volumes ensuring data safety."

## Slide 11: CI/CD Pipeline (Jenkins)
- **Content**: SDLC/Jenkins Flowchart (Lint -> Test -> Build -> Docker).
- **Speaking Points**: "We enforce quality via a Jenkins CI/CD pipeline. Every commit triggers static analysis, Vitest smoke tests, and a production build. If successful, it builds the Docker image for deployment."

## Slide 12: Monitoring & Observability
- **Content**: Prometheus/Grafana integration overview.
- **Speaking Points**: "For day-two operations, we configured Prometheus to scrape our `/api/health` endpoints, and provisioned Grafana dashboards to visualize system metrics and API latency."

## Slide 13: Technical Challenges
- **Content**: 1.7GB Docker context, Next.js 15 async route params, Hydration mismatches.
- **Speaking Points**: "We overcame significant challenges. We optimized a bloated 1.7GB Docker build context by repositioning `.dockerignore`, and resolved strict React 19 hydration mismatches by flattening CSS template strings."

## Slide 14: Future Scaling & Improvements
- **Content**: Redis caching, Kubernetes, Playwright E2E.
- **Speaking Points**: "To scale further, we plan to implement a Redis caching layer for API responses, migrate from Docker Compose to Kubernetes, and add Playwright for comprehensive End-to-End testing."

## Slide 15: Q&A and Demo
- **Content**: Thank You / Links.
- **Speaking Points**: "Thank you for your time. I will now perform a live demonstration of the API Playground and Command Palette, followed by any questions you might have."
