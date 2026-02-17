## Overview
This infrastructure provisions a 3-tier web architecture on AWS using CDK.

## Architecture
- VPC (2 AZ)
- Public Subnets (ALB)
- Private Subnet (ECS Fargate)
- NAT Gateway (single AZ for cost optimization)
- Application Load Balancer
- ECS Fargate Service

## Design Decisions
- ALB requires at least 2 Availability Zones
- Single NAT Gateway used to reduce cost
- Tasks deployed in private subnets
- Internet access provided via NAT

## Deployment
```bash
aws sso login --profile dev-sso
cdk deploy --profile dev-sso
```

## Destroy
```bash
cdk destroy --profile dev-sso
````
