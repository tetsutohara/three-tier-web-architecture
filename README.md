# AWS 3-Tier Infrastructure Baseline

## Goal
The goal of this project is to design and implement a production-like AWS 3-tier architecture with a minimum API application

This project focuses on infrastructure design rather than application complexity.

## Architecture
The architecture will include: 

- VPC with public and private subnets across 2 Availability Zones
- Application Load Balancer (ALB)
- ECS Fargate for application runtime
- RDS (optional, later phase)
- IAM least-privilege design
- CloudWatch logging and monitoring 
- Infrastructure as Code using SDK

Architecture diagram: Coming soon.

## Design Philosophy
- Separation of public and private resources
- Security-first approach (no direct access to private resources)
- High availability across multiple AZs
- Reproducible infrastructure using IaC

## How to Deploy
Coming soon.