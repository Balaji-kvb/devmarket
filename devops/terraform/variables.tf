variable "aws_region" {
  description = "The AWS region to deploy infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., production, staging)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "EC2 instance type for the application server"
  type        = string
  default     = "t3.medium" # Minimum recommended for Next.js + Postgres + Docker
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance (Ubuntu 22.04 LTS)"
  type        = string
  default     = "ami-0c7217cdde317cfec" # Example Ubuntu AMI
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
  default     = "devmarket-deploy-key"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into the server"
  type        = string
  default     = "0.0.0.0/0" # Update to specific IP in production!
}
