# 0003 - VPC Endpoints Instead of NAT Gateway

## Status
Accepted

## Supersedes

ADR 0001 - Use 2 Availability Zones for VPC

## Context

Instead of using a NAT Gateway in the VPC, interface and gateway VPC endpoints are configured to allow ECS Fargate tasks in private subnets to pull container images from Amazon ECR and communicate with required AWS services without accessing the public internet.

## Decision

VPC endpoints are provisioned for the following services:

- **Amazon ECR (API)** – for retrieving authentication tokens and calling ECR APIs  
- **Amazon ECR (Docker)** – for pulling container images  
- **Amazon CloudWatch Logs** – for sending application logs  
- **Amazon S3 (Gateway Endpoint)** – for accessing image layers stored in S3  

## Consequences

### Positive

- Reduced cost compared to using a NAT Gateway
- Improved security by eliminating outbound internet access from private subnets
- Traffic to AWS services remains within the AWS network

|                                | NAT Gateway | VPC Endpoint            |
|--------------------------------|-------------|-------------------------|
| Price (USD/hour)               | 0.062       | 0.014 (per AZ)          |
| Data processing (USD/GB)       | 0.062       | 0.01 (first 1 PB) |

### Negative

- Private subnets cannot access the public internet
- Additional configuration complexity (multiple endpoints required)
- Interface endpoints incur per-AZ hourly costs

## Alternatives Considered

1. **Use a NAT Gateway**
   - Simpler architecture
   - Allows general outbound internet access
   - Higher operational cost