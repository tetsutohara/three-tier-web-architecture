import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';


export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // AZ = 2 + NAT = 1
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        { name: 'Public', subnetType: ec2.SubnetType.PUBLIC, cidrMask: 24 },
        { name: 'App', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, cidrMask: 24 },
      ],
    });

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    // ALB (Public) + Fargate (Private)
    const svc = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      publicLoadBalancer: true,
      desiredCount: 1,
      taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:latest'),
        containerPort: 80,
      },
    });
    
    svc.targetGroup.configureHealthCheck({path: '/'});

    new cdk.CfnOutput(this, 'AlbDnsName', {
      value: svc.loadBalancer.loadBalancerDnsName,
    });
  }
}
