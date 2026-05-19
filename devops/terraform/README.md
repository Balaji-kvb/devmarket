# Infrastructure as Code (Terraform)

This directory contains the Terraform configuration to provision the AWS infrastructure required to run DevMarket in production.

## Architecture

- **VPC & Networking**: Dedicated VPC with a public subnet and internet gateway.
- **Security Group**: Allows HTTP (80), HTTPS (443), and restricted SSH (22).
- **Compute (EC2)**: A `t3.medium` instance pre-configured via `user_data` to install Docker and Docker Compose.

## Usage

1. **Initialize Terraform**
   ```bash
   terraform init
   ```

2. **Configure Variables**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your specific AWS details
   ```

3. **Plan the Deployment**
   ```bash
   terraform plan
   ```

4. **Apply the Infrastructure**
   ```bash
   terraform apply
   ```

*Note: For academic purposes, this acts as a robust simulation model demonstrating IaC and cloud-native provisioning.*
