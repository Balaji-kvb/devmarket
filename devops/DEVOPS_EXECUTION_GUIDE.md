# DevMarket DevOps Command Handbook

# 1. Install Docker

Verify Docker installation.

```bash
docker --version
```

Expected output:

```text
Docker version 24.0.5, build ced0996
```

[Insert Screenshot: Docker version terminal output]

Pull essential images.

```bash
docker pull postgres:15-alpine
docker pull node:20-alpine
docker pull prom/prometheus:latest
docker pull grafana/grafana:latest
```

Expected output:

```text
Status: Downloaded newer image for postgres:15-alpine
```

[Insert Screenshot: Docker pull terminal output]

---

# 2. Clone Repository

Clone the project locally.

```bash
git clone https://github.com/Balaji-kvb/devmarket.git
cd devmarket
```

Expected output:

```text
Cloning into 'devmarket'...
```

[Insert Screenshot: Git clone completion]

---

# 3. Environment Variables

Create `.env` in `frontend/`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="devmarket-secret"
APP_VERSION="1.0.0"
NODE_ENV="production"
```

[Insert Screenshot: VS Code showing .env file]

---

# 4. PostgreSQL Setup

Generate Prisma client.

```bash
npx prisma generate
```

Expected output:

```text
✔ Generated Prisma Client (v5.x.x)
```

Run database migrations.

```bash
npx prisma migrate dev --name init
```

Expected output:

```text
Your database is now in sync with your schema.
```

Open Prisma Studio.

```bash
npx prisma studio
```

Expected output:

```text
Prisma Studio is up on http://localhost:5555
```

[Insert Screenshot: Prisma Studio UI in browser]

---

# 5. Docker Compose Execution

Start all services in detached mode.

```bash
cd devops/docker
docker compose up -d --build
```

Expected output:

```text
[+] Running 6/6
 ✔ Container postgres    Started
 ✔ Container app         Started
 ✔ Container pgadmin     Started
 ✔ Container prometheus  Started
 ✔ Container grafana     Started
 ✔ Container nginx       Started
```

[Insert Screenshot: Docker compose up completion]

Check running containers.

```bash
docker ps
```

Expected output:

```text
CONTAINER ID   IMAGE      COMMAND                  PORTS
abc123def456   app        "docker-entrypoint.s…"   0.0.0.0:3000->3000/tcp
```

[Insert Screenshot: docker ps showing all containers running]

Stop and remove all containers.

```bash
docker compose down
```

Expected output:

```text
[+] Running 7/7
 ✔ Container nginx       Removed
 ✔ Container grafana     Removed
 ✔ Container prometheus  Removed
 ✔ Container pgadmin     Removed
 ✔ Container app         Removed
 ✔ Container postgres    Removed
 ✔ Network devmarket     Removed
```

[Insert Screenshot: Docker compose down terminal output]

---

# 6. Jenkins Setup

Pull Jenkins image.

```bash
docker pull jenkins/jenkins:lts
```

Run Jenkins container.

```bash
docker run -d -p 8080:8080 -p 50000:50000 --name jenkins jenkins/jenkins:lts
```

Expected output:

```text
a1b2c3d4e5f6... (Container ID)
```

[Insert Screenshot: Jenkins container start]

Get admin password.

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Expected output:

```text
4a9b8c7d6e5f4a9b8c7d6e5f4a9b8c7d
```

[Insert Screenshot: Jenkins unlock password in terminal]

---

# 7. Jenkins Pipeline

1. Create new item > Pipeline
2. Check "GitHub project", paste URL
3. Definition: "Pipeline script from SCM"
4. SCM: Git
5. Branch Specifier: `*/main`
6. Script Path: `Jenkinsfile`
7. Save & click "Build Now"

[Insert Screenshot: Jenkins Pipeline configuration screen]
[Insert Screenshot: Jenkins Build Success Stage View]

---

# 8. Prometheus Setup

Ensure `devops/monitoring/prometheus.yml` exists.

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'devmarket'
    metrics_path: /api/metrics
    static_configs:
      - targets: ['app:3000']
```

[Insert Screenshot: prometheus.yml file contents]
[Insert Screenshot: Prometheus targets page showing app UP]

---

# 9. Grafana Setup

Login at `http://localhost:3001` (admin / admin).

1. Data Sources > Add data source
2. Select **Prometheus**
3. URL: `http://prometheus:9090`
4. Click "Save & test"

[Insert Screenshot: Grafana Add Data Source Screen]

Create Dashboard.

1. New Dashboard > Add Query
2. Select Prometheus data source
3. Metric browser: `devmarket_status`
4. Run query & Save

[Insert Screenshot: Grafana Dashboard showing DevMarket status]

---

# 10. pgAdmin Setup

Login at `http://localhost:8080` (admin@admin.com / admin).

1. Add New Server
2. Name: `DevMarket DB`
3. Connection > Host: `postgres`
4. Port: `5432`
5. Username: `postgres`
6. Password: `postgres`
7. Save

[Insert Screenshot: pgAdmin Add Server connection settings]
[Insert Screenshot: pgAdmin showing DevMarket tables]

---

# 11. Metrics Verification

Verify metrics endpoint in browser.

```bash
http://localhost:3000/api/metrics
```

Expected output:

```text
# HELP devmarket_status DevMarket application status
# TYPE devmarket_status gauge
devmarket_status 1
```

[Insert Screenshot: Browser showing raw metrics output]

---

# 12. Health Endpoint

Verify health endpoint in browser.

```bash
http://localhost:3000/api/health
```

Expected output:

```json
{"status":"ok"}
```

[Insert Screenshot: Browser showing JSON health status]

---

# 13. Common Error Fixes

## Error: Prometheus 404

Fix:

```yaml
scrape_configs:
  - job_name: 'devmarket'
    metrics_path: /api/metrics
    static_configs:
      - targets: ['app:3000']
```

## Error: Port 3000 is already in use

Fix:

```bash
kill -9 $(lsof -t -i:3000)
```

## Error: Prisma Client not found

Fix:

```bash
npx prisma generate
```
