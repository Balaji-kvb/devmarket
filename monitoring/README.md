# Monitoring & Observability

This directory contains the configurations for the DevMarket observability stack.

## Architecture

We utilize the standard cloud-native stack:
- **Prometheus**: Time-series database for scraping and storing metrics.
- **Grafana**: Visualization dashboard for metric analysis.

## Configuration Details

- `prometheus/prometheus.yml`: Configured to scrape the Next.js app (`/api/health` acting as a simulated metrics endpoint for this academic model), Nginx, and PostgreSQL.
- `grafana/provisioning`: Automates the setup of the Prometheus datasource and default dashboards, meaning Grafana spins up fully configured.
- `grafana/dashboards`: Contains JSON exports of our critical dashboards (System Metrics and Application Metrics).

*Note: In a full production cluster, you would add `prometheus` and `grafana` containers to the `docker-compose.yml` file and mount these directories as volumes.*
