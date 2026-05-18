output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.devmarket_vpc.id
}

output "public_ip" {
  description = "The public IP address of the application server"
  value       = aws_instance.app_server.public_ip
}

output "app_url" {
  description = "The URL to access the application"
  value       = "http://${aws_instance.app_server.public_ip}"
}
