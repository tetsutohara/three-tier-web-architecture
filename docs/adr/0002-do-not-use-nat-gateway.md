# 0002 - Do Not Use NAT Gateway (Use VPC Endpoints Instead)

## Status
Accepted

## Context

In a typical production environment, NAT Gateways are often deployed to allow resources in private subnets to access the internet.

A common cost-optimized pattern is to deploy a single NAT Gateway and route private subnets in multiple Availability Zones through it.  
However, NAT Gateways incur a fixed hourly cost regardless of traffic volume.

In this project, ECS tasks running in private subnets primarily require outbound access only to **AWS-managed services**, such as:

- Amazon ECR (image pull)
- Amazon S3 (image layers)
- CloudWatch Logs
- Secrets Manager / STS (if needed)

There is **no requirement for ECS tasks to access the public internet or external third-party APIs**.

## Decision

A NAT Gateway is not deployed.

Instead, outbound communication from private subnets is restricted to AWS-managed services by using **VPC Endpoints**, including:

- Interface Endpoints for ECR (API / DKR) and CloudWatch Logs
- Gateway Endpoint for Amazon S3

This design eliminates the need for internet-bound outbound traffic while still allowing ECS tasks to operate correctly.

## Consequences

### Positive

- Eliminates fixed hourly NAT Gateway cost
- Reduces attack surface by preventing internet egress
- Demonstrates a cost-efficient and security-conscious network design
- Enables ECS tasks in private subnets to pull container images without internet access

### Negative

- ECS tasks cannot access external internet services
- Additional configuration complexity due to multiple VPC Endpoints
- External API integration would require reintroducing a NAT Gateway or alternative egress mechanism

## Alternatives Considered

1. Deploy a single NAT Gateway  
   - Provides general outbound internet access  
   - Rejected due to unnecessary cost for this use case

2. Deploy one NAT Gateway per Availability Zone  
   - Provides higher availability  
   - Rejected due to higher cost and lack of necessity for this portfolio project

## Notes

If future requirements introduce outbound access to external services (e.g. third-party APIs),  
a NAT Gateway or another controlled egress solution can be added without changing the overall architecture.
