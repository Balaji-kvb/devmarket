# Monitoring Architecture

DevMarket is designed to integrate with industry-standard observability tools.

## 1. Monitoring Flow

```mermaid
graph TD
    NextApp[Next.js App /api/health] -->|Scrape| Prom[Prometheus]
    Nginx[Nginx Exporter] -->|Scrape| Prom
    Postgres[PostgreSQL Exporter] -->|Scrape| Prom
    
    Prom -->|Data Source| Grafana[Grafana Dashboards]
    Grafana -->|Alerts| Slack[Slack/PagerDuty]
```

## 2. Components
- **Health Endpoint**: `/api/health` returns JSON payloads detailing DB connection status, uptime, and latency.
- **Prometheus**: Configured via `prometheus.yml` to periodically scrape targets.
- **Grafana**: Visualizes CPU usage, request latency, and HTTP status codes via pre-provisioned dashboards.
