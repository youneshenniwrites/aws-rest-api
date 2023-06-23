import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { IBlogPost } from "../types/blog-post-types";

class BlogPostService {
  private tableName: string;
  private dynamo: DynamoDBClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.dynamo = new DynamoDBClient({});
  }

  async saveBlogPost(blogPost: IBlogPost): Promise<void> {
    const params = {
      TableName: this.tableName,
      //* Convert to dynamodb format
      Item: marshall(blogPost),
    };

    const command = new PutItemCommand(params);
    await this.dynamo.send(command);
  }

  async getAllBlogPosts(): Promise<IBlogPost[]> {
    const params = {
      TableName: this.tableName,
    };

    const command = new ScanCommand(params);
    const response = await this.dynamo.send(command);
    const items = response.Items ?? [];

    return items.map((item) => unmarshall(item) as IBlogPost);
  }
}

const tableName = process.env.TABLE_NAME!;
export const blogPostService = new BlogPostService(tableName);
