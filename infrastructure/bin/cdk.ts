#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { NetworkStack } from '../lib/network-stack';
import { ApiStack } from '../lib/api-stack';
import { FrontendStaticStack } from '../lib/frontend-stack';
import { AuthStack } from '../lib/cognito-login';


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

const frontend = new FrontendStaticStack(app, "FrontendStack", {
  env,
  apiAlbDnsName: api.albDnsName,
});

const auth = new AuthStack(app, "AuthStack", {
  env,
  // distribution: frontend.distribution
})