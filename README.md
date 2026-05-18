<div align="center">
  <img src="/public/favicon.ico" alt="DevMarket Logo" width="80" height="80">
  <h1 align="center">DevMarket — Developer Ecosystem Platform</h1>

  <p align="center">
    A premium, production-ready SaaS platform unifying API discovery, developer utilities, and industry news. Built with a robust cloud-native DevOps architecture.
    <br />
    <a href="#architecture"><strong>Explore the Architecture »</strong></a>
    <br />
    <br />
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
    <img src="https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform" alt="Terraform" />
    <img src="https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=for-the-badge&logo=jenkins" alt="Jenkins" />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#architecture--devops-workflow">Architecture & DevOps Workflow</a></li>
    <li><a href="#infrastructure-as-code-terraform">Infrastructure (Terraform)</a></li>
    <li><a href="#monitoring--observability">Monitoring (Prometheus/Grafana)</a></li>
    <li><a href="#getting-started-setup-guide">Getting Started (Setup Guide)</a></li>
    <li><a href="#deployment-guide">Deployment Guide</a></li>
    <li><a href="#testing--quality-assurance">Testing & QA</a></li>
    <li><a href="#challenges--solutions">Challenges & Solutions</a></li>
    <li><a href="#future-scope--scaling-strategy">Future Scope & Scaling Strategy</a></li>
  </ol>
</details>

---

## About The Project

DevMarket is an enterprise-grade web application designed to solve developer workflow fragmentation. Instead of juggling Postman, online JSON formatters, and tech blogs, developers use DevMarket as a unified command center. 

**Core Features**:
- Interactive API Testing Playground (with server-side CORS proxy)
- Web-based Developer Utility Suite (JSON formatter, Base64 encoder)
- Command Palette (`⌘K`) Navigation
- JWT-based OAuth Authentication via NextAuth
- Relational Collections & Bookmarks

---

## Architecture & DevOps Workflow

DevMarket is built using a highly scalable, decoupled monolithic architecture optimized for containerized deployment.

### System Architecture
Traffic flows through an Nginx reverse proxy into the Next.js (App Router) container, which interfaces with a PostgreSQL cluster via Prisma ORM.

### CI/CD Pipeline (Jenkins)
The SDLC is fully automated via `Jenkinsfile`. Every commit triggers:
1. **Static Analysis**: ESLint and strict TypeScript checking.
2. **Smoke Testing**: Vitest validates React components and API endpoints.
3. **Build Phase**: Next.js compiles an optimized standalone Node.js server.
4. **Containerization**: A multi-stage Docker build produces a lean Alpine image.
5. **Deployment**: Simulated continuous deployment to the staging environment.

---

## Infrastructure as Code (Terraform)

The `terraform/` directory contains the blueprint for our AWS production environment. 
By running `terraform apply`, we automatically provision:
- A secure AWS VPC with public/private subnets.
- An EC2 `t3.medium` instance pre-configured with the Docker daemon.
- Restrictive Security Groups allowing only HTTP, HTTPS, and specific IP SSH access.

---

## Monitoring & Observability

Located in the `monitoring/` directory, the platform is instrumented for day-two operations:
- **Prometheus**: Configured to scrape the `/api/health` endpoint, tracking database connectivity and latency.
- **Grafana**: Pre-provisioned dashboards visualize application uptime, CPU load, and Next.js server metrics to ensure SLA compliance.

---

## Getting Started (Setup Guide)

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-org/devmarket.git
   cd devmarket
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and set your `NEXTAUTH_SECRET` and Database URLs.

3. **Database Initialization**
   ```bash
   docker-compose -f docker/docker-compose.yml up -d postgres
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## Deployment Guide

Production deployment relies on Docker Compose to guarantee environment parity.

1. **Build the Cluster**
   ```bash
   docker-compose -f docker/docker-compose.yml build app
   ```
2. **Spin Up Production**
   ```bash
   docker-compose -f docker/docker-compose.yml up -d app nginx
   ```
*Nginx will now serve the highly-optimized Next.js standalone build on port 80.*

---

## Testing & Quality Assurance

DevMarket maintains high reliability through a lightweight, high-value testing pyramid:
- **Unit Tests**: Coverage for utility functions (e.g., JSON parsing validation).
- **Component Smoke Tests**: Ensures UI components like `APICard` mount correctly.
- **Endpoint Tests**: Verifies API routes return `200 OK` and proper JSON structures.
To run tests locally: `npm run test`

---

## Challenges & Solutions

- **1.7GB Docker Build Context**: Initial builds were extremely slow. We solved this by properly configuring `.dockerignore` at the project root to exclude `node_modules` and `.next`.
- **Next.js 15 Async Routing**: Upgrading to React 19 / Next.js 15 caused dynamic routes to crash. We refactored dynamic `params` to be awaited Promises.
- **React 19 Hydration Errors**: Mismatches between server HTML and client hydration due to multiline CSS strings. Solved by flattening template strings in Layout components.

---

## Future Scope & Scaling Strategy

1. **Kubernetes Migration**: Transition from `docker-compose` to K8s Deployments and Services for true horizontal auto-scaling.
2. **Redis Caching**: Implement an external Redis layer to cache API metadata and News feeds, reducing PostgreSQL load.
3. **End-to-End Testing**: Integrate Playwright to automate critical user journeys (e.g., login, bookmarking) in the CI pipeline.

---
*Developed with a focus on modern engineering standards, clean architecture, and DevOps maturity.*
