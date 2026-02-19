#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { NetworkStack } from '../lib/network-stack';
import { ApiStack } from '../lib/api-stack';
import { FrontendStaticStack } from '../lib/frontend-stack';


const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const network = new NetworkStack(app, "NetworkStack", { env });

const api = new ApiStack(app, "ApiStack", {
  env,
  vpc: network.vpc,
});

new FrontendStaticStack(app, "FrontendStack", {
  env,
  apiAlbDnsName: api.albDnsName,
});
