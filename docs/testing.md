# Testing Strategy

DevMarket employs a lightweight, high-value testing strategy focusing on structural integrity and critical paths.

## 1. Test Layers
- **Static Analysis**: TypeScript (`npx tsc --noEmit`) ensures type safety across the entire codebase.
- **Linting**: ESLint enforces strict code styling and catches React Hook dependency issues.
- **Smoke Tests**: Vitest validates that the application renders without crashing (`page.test.tsx`).
- **Utility Tests**: Deep coverage on pure functions (e.g., JSON parsers) to prevent runtime crashes.
- **Endpoint Tests**: Validation of the `/api/health` endpoint and its simulated database connection.

## 2. CI Integration
All tests must pass in the Jenkins/GitHub Actions pipeline before a Docker image can be built. This prevents broken code from reaching the production cluster.
