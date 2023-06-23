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

    //* Lambda Function 1
    const createBlogPostLambdaName = "createBlogPostHandler";
    const createBlogPostLambda = new LambdaFunction(
      this,
      createBlogPostLambdaName,
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(__dirname, "lambdas", "blog-post-handler.ts"),
        handler: createBlogPostLambdaName,
        functionName: createBlogPostLambdaName,
        //* Connect lambda to dynamo db
        environment: { TABLE_NAME: dynamoDbTable.tableName },
      }
    );

    //* Lambda Function 2
    const getBlogPostLambdaName = "getBlogPostHandler";
    const getBlogPostLambda = new LambdaFunction(this, getBlogPostLambdaName, {
      runtime: Runtime.NODEJS_18_X,
      entry: join(__dirname, "lambdas", "blog-post-handler.ts"),
      handler: getBlogPostLambdaName,
      functionName: getBlogPostLambdaName,
      //* Connect lambda to dynamo db
      environment: { TABLE_NAME: dynamoDbTable.tableName },
    });

    //* Connect lambdas to API and add resources/methods
    const blogPostPath = api.root.addResource("blogposts");
    blogPostPath.addMethod(
      "POST",
      new ApiLambdaIntegration(createBlogPostLambda)
    );
    blogPostPath.addMethod("GET", new ApiLambdaIntegration(getBlogPostLambda));

    //* Grant permission for lambdas to communicate with dynamodb
    dynamoDbTable.grantWriteData(createBlogPostLambda);
    dynamoDbTable.grantReadData(getBlogPostLambda);
  }
}
