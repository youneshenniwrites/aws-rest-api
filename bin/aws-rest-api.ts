#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsRestApiStack } from "../lib/aws-rest-api-stack";

const app = new cdk.App();
const region = "us-west-1";
const account = "123123123123";
new AwsRestApiStack(app, "AwsRestApiStack", {
  env: { region: region, account: account },
});
