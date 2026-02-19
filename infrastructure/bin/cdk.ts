#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import {FrontendStaticStack} from '../lib/frontend-stack';


const app = new cdk.App();
new FrontendStaticStack(app, 'FrontendStack');