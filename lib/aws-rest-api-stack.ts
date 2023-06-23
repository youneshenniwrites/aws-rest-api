import { Stack, StackProps } from "aws-cdk-lib";
import {
  LambdaIntegration as ApiLambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import {
  AttributeType,
  Table as DynamoDbTable,
} from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction as LambdaFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class AwsRestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //* API Gateway
    const restApi = new RestApi(this, "blogPostApi");

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
    const getBlogPostsLambdaName = "getBlogPostsHandler";
    const getBlogPostsLambda = new LambdaFunction(
      this,
      getBlogPostsLambdaName,
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(__dirname, "lambdas", "blog-post-handler.ts"),
        handler: getBlogPostsLambdaName,
        functionName: getBlogPostsLambdaName,
        environment: { TABLE_NAME: dynamoDbTable.tableName },
      }
    );

    //* Lambda Function 3
    const getBlogPostLambdaName = "getBlogPostHandler";
    const getBlogPostLambda = new LambdaFunction(this, getBlogPostLambdaName, {
      runtime: Runtime.NODEJS_18_X,
      entry: join(__dirname, "lambdas", "blog-post-handler.ts"),
      handler: getBlogPostLambdaName,
      functionName: getBlogPostLambdaName,
      environment: { TABLE_NAME: dynamoDbTable.tableName },
    });

    //* Lambda Function 4
    const deleteBlogPostLambdaName = "deleteBlogPostHandler";
    const deleteBlogPostLambda = new LambdaFunction(
      this,
      deleteBlogPostLambdaName,
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(__dirname, "lambdas", "blog-post-handler.ts"),
        handler: deleteBlogPostLambdaName,
        functionName: deleteBlogPostLambdaName,
        environment: { TABLE_NAME: dynamoDbTable.tableName },
      }
    );

    //* Lambda Function 5
    const apiDocsLambdaName = "apiDocsHandler";
    const apiDocsLambda = new LambdaFunction(this, apiDocsLambdaName, {
      runtime: Runtime.NODEJS_18_X,
      entry: join(__dirname, "lambdas", "blog-post-handler.ts"),
      handler: apiDocsLambdaName,
      functionName: apiDocsLambdaName,
      environment: { API_ID: restApi.restApiId },
    });

    //* Define API Paths
    const blogPostPath = restApi.root.addResource("blogposts");
    const blogPostByIdPath = blogPostPath.addResource("{id}"); // blogposts/{id}
    const apiDocsPath = restApi.root.addResource("api-docs");

    //* Connect lambdas to API methods
    blogPostPath.addMethod(
      "POST",
      new ApiLambdaIntegration(createBlogPostLambda)
    );
    blogPostPath.addMethod(
      "GET",
      new ApiLambdaIntegration(getBlogPostsLambda),
      {
        requestParameters: {
          "method.request.querystring.order": false,
        },
      }
    );
    blogPostByIdPath.addMethod(
      "GET",
      new ApiLambdaIntegration(getBlogPostLambda)
    );
    blogPostByIdPath.addMethod(
      "DELETE",
      new ApiLambdaIntegration(deleteBlogPostLambda)
    );
    apiDocsPath.addMethod("GET", new ApiLambdaIntegration(apiDocsLambda));

    //* Grant permission for lambdas to interact with dynamodb
    dynamoDbTable.grantWriteData(createBlogPostLambda);
    dynamoDbTable.grantReadData(getBlogPostsLambda);
    dynamoDbTable.grantReadData(getBlogPostLambda);
    dynamoDbTable.grantWriteData(deleteBlogPostLambda);

    //* Grant permission for lambda to interact with swagger
    const policy = new PolicyStatement({
      actions: ["apigateway:GET"],
      resources: ["*"],
    });
    apiDocsLambda.role?.addToPrincipalPolicy(policy);
  }
}
