#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsRestApiStack } from '../lib/aws-rest-api-stack';

const app = new cdk.App();
new AwsRestApiStack(app, 'AwsRestApiStack');
