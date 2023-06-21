#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsRestApiStack } from "../lib/aws-rest-api-stack";

const app = new cdk.App();
const region = "eu-west-2";
const account = "367985501708";
new AwsRestApiStack(app, "AwsRestApiStack", { env: { region, account } });
