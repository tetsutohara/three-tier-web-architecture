import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as path from "path";

export interface ApiStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class ApiStack extends cdk.Stack {
  public readonly albDnsName: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: props.vpc
    });

    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "ApiService",
      {
        cluster,
        publicLoadBalancer: true,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset(
            path.join(__dirname, "..", "..", "backend")
          ),
        },
        minHealthyPercent: 50,
      }
    );

    this.albDnsName = service.loadBalancer.loadBalancerDnsName;
  }
}
