import { Stack, StackProps } from "aws-cdk-lib";
import {
  LambdaIntegration as ApiLambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import {
  AttributeType,
  Table as DynamoDbTable,
} from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction as LambdaFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class AwsRestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //* API Gateway
    const api = new RestApi(this, "blogPostApi");

    //* Database
    const dynamoDbTable = new DynamoDbTable(this, "blogPostTable", {
      tableName: "blogPostTable",
      //* This field is important as it serves as primary key
      partitionKey: { name: "id", type: AttributeType.STRING },
    });

    //* Lambda Function
    const createBLogPostLambdaName = "createBLogPostHandler";
    const createBLogPostLambda = new LambdaFunction(
      this,
      createBLogPostLambdaName,
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(__dirname, "lambdas", "blog-post-handler.ts"),
        handler: createBLogPostLambdaName,
        functionName: createBLogPostLambdaName,
        environment: { TABLE_NAME: dynamoDbTable.tableName },
      }
    );

    //* Connect lambda to API and add resources/methods
    const blogPostPath = api.root.addResource("blogposts");
    blogPostPath.addMethod(
      "POST",
      new ApiLambdaIntegration(createBLogPostLambda)
    );

    //* Grant permission for lambda to write to dynamodb
    dynamoDbTable.grantWriteData(createBLogPostLambda);
  }
}
