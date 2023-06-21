import { Stack, StackProps } from "aws-cdk-lib";
import {
  LambdaIntegration as ApiLambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction as LambdaFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class AwsRestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "blogPostApi");

    const createBLogPostLambdaName = "createBLogPostHandler";
    const createBLogPostLambda = new LambdaFunction(
      this,
      createBLogPostLambdaName,
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(__dirname, "lambdas", "blog-post-handler.ts"),
        handler: createBLogPostLambdaName,
        functionName: createBLogPostLambdaName,
      }
    );

    // API resources and methods
    const blogPostPath = api.root.addResource("blogposts");
    blogPostPath.addMethod(
      "POST",
      new ApiLambdaIntegration(createBLogPostLambda)
    );
  }
}
