import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { IBlogPost } from "../types/blog-post-types";

class BlogPostService {
  private tableName: string;
  private dynamo: DynamoDBClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.dynamo = this.dynamo;
  }

  async saveBlogPost(blogPost: IBlogPost): Promise<void> {
    const params = {
      TableName: this.tableName,
      //* convert to dynamodb format
      Item: marshall(blogPost),
    };

    const command = new PutItemCommand(params);
    await this.dynamo.send(command);
  }
}

const tableName = process.env.TABLE_NAME!;
export const blogPostService = new BlogPostService(tableName);
