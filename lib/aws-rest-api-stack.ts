import { Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction as AWSLambdaFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class AwsRestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const createBLogPostLambdaName = "createBLogPostHandler";
    const createBLogPostLambda = new AWSLambdaFunction(
      this,
      createBLogPostLambdaName,
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(__dirname, "lambdas", "blog-post-handler.ts"),
        handler: createBLogPostLambdaName,
        functionName: createBLogPostLambdaName,
      }
    );
  }
}
