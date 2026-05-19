# DevMarket: End-to-End DevOps Execution Guide

This document is your **step-by-step runbook** for executing the DevMarket DevOps pipeline locally. Follow these steps sequentially to generate the live execution proof (screenshots) required for your university evaluation. 

By following this guide, you will demonstrate a "cloud-native full-stack application managed using DevOps infrastructure."

---

## 🏗️ Stage 1: Infrastructure as Code (Terraform)
*Proves to the evaluator that the server hosting the application is provisioned automatically, not manually.*

1. **Open your terminal** and navigate to the Terraform directory:
   ```bash
   cd devops/terraform
   ```
2. **Initialize Terraform** (downloads the AWS provider plugins):
   ```bash
   terraform init
   ```
3. **Execute the Plan** (simulates the creation of the EC2 instance and VPC):
   ```bash
   terraform plan
   ```
4. 📸 **Screenshot 1:** Take a screenshot of the terminal output where the green text says `Plan: X to add, 0 to change, 0 to destroy`. This proves the AWS infrastructure (VPC, Security Groups, EC2) is defined and ready.

---

## 🐳 Stage 2: Container Orchestration (Docker & PostgreSQL)
*Proves that the application is containerized and orchestrated alongside its dependencies (DB, Nginx).*

1. **Return to the root** of your project:
   ```bash
   cd ../..
   ```
2. **Spin up the entire stack** in the background:
   ```bash
   docker-compose -f devops/docker/docker-compose.yml up --build -d
   ```
3. **Verify all containers are running**:
   ```bash
   docker ps
   ```
4. 📸 **Screenshot 2:** Take a screenshot of the `docker ps` output. Ensure the image names `postgres:15-alpine`, `prom/prometheus`, `grafana/grafana`, `nginx:stable-alpine`, and `devmarket-app` are visible and their status says `Up`.

---

## 🗄️ Stage 3: Database Integration (pgAdmin)
*Proves that PostgreSQL is live and securely connected to DevMarket.*

1. Open your web browser and go to **http://localhost:8080**
2. **Login credentials:**
   - Email: `admin@admin.com`
   - Password: `admin`
3. Click **Add New Server** and enter the following:
   - **General Tab -> Name:** `DevMarket DB`
   - **Connection Tab -> Host name/address:** `postgres`
   - **Connection Tab -> Port:** `5432`
   - **Connection Tab -> Username:** `postgres`
   - **Connection Tab -> Password:** `postgres`
   - Click **Save**.
4. 📸 **Screenshot 3:** Expand the sidebar `Servers -> DevMarket DB -> Databases -> devmarket`. Take a screenshot showing the connected database.

---

## 📈 Stage 4: Live Observability (Prometheus & Grafana)
*Proves you have implemented continuous monitoring for your containers.*

### Prometheus (The Metrics Scraper)
1. Open your browser and go to **http://localhost:9090/targets**
2. 📸 **Screenshot 4:** Take a screenshot showing the `devmarket` endpoint listed in the **UP** state. This proves Prometheus is successfully monitoring the Docker network.

### Grafana (The Visualization Dashboard)
1. Open your browser and go to **http://localhost:3001**
2. **Login credentials:**
   - Username: `admin`
   - Password: `admin` (You will be prompted to change it, you can click "Skip").
3. Click **Data Sources** -> **Add data source** -> Select **Prometheus**.
   - Under Connection URL, enter exactly: `http://prometheus:9090`
   - Scroll down and click **Save & test**. (It should say "Data source is working").
4. Go to **Dashboards** -> **Import**.
5. Upload the file located at `devops/monitoring/grafana-dashboard.json`.
6. 📸 **Screenshot 5:** Take a screenshot of the beautiful Grafana graphs showing CPU and Memory usage for the DevMarket containers.

---

## ⚙️ Stage 5: Continuous Integration (Jenkins)
*Proves that code commits automatically trigger builds and testing.*

1. Open your locally installed Jenkins dashboard (usually `http://localhost:8080` if not conflicting with pgAdmin, ensure Jenkins is running on a different port if installed locally).
2. Create a new **Pipeline** item named `DevMarket-CI`.
3. Under the **Pipeline** section:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: *(Enter your GitHub repo URL)*
   - Script Path: `devops/Jenkinsfile`
4. Click **Save** and then click **Build Now**.
5. 📸 **Screenshot 6:** Once the build finishes, take a screenshot of the **Stage View** showing the green successful blocks for:
   - *Install Dependencies*
   - *Lint & Type Check*
   - *Build Production App*
   - *Docker Build*

---

### Final Submission Checklist
To get top marks, ensure your final PDF/Presentation tells the story in this exact order:
1. **Code Commit** (Show Jenkins Pipeline succeeding)
2. **Infrastructure** (Show Terraform Plan)
3. **Containerization** (Show `docker ps` output)
4. **Database** (Show pgAdmin connection)
5. **Monitoring** (Show Grafana Dashboard)

*If you follow these steps, you have successfully demonstrated an enterprise-grade DevOps lifecycle centered entirely around the DevMarket application!*
