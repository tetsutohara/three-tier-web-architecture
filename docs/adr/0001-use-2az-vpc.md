# 0001 - Use 2 Availability Zones for VPC

## Status
Accepted (NAT-based outbound design amended by ADR 0003)

## Context

The initial design used a single Availability Zone (maxAzs: 1) to minimize cost.

However, during deployment, the following error occurred:

> At least two subnets in two different Availability Zones must be specified (Service: ElasticLoadBalancingV2, Status Code: 400)

Application Load Balancer (ALB) requires subnets in at least two different Availability Zones.

Additionally, high availability is a common production requirement.

## Decision
The VPC will be configured with:

- `maxAzs: 2`
- Public subnets in 2 AZs for ALB
- Private subnets in 2 AZs for ECS Fargate

NAT Gateway remains single-AZ to reduce cost.

## Consequences

### Positive

- Satisfies ALB requirement
- Improves availability
- Aligns with production-grade architecture patterns

### Negative 

- Slightly increased subnet adn routing complexity
- Potential cross-AZ data transfer cost

## Alternatives Considered

1. Keep single AZ and remove ALB
    -> Rejected (does not reflect production design)
2. Use NLB instead of ALB
    -> Rejected (ALB provides Layer 7 routing)
    
## Notes

This decision reflects a balance between high availability and const optimization.