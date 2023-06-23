import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {
  marshall as applyDynamoDbFormat,
  unmarshall as parseDynamoDbFormat,
} from "@aws-sdk/util-dynamodb";
import { IBlogPost } from "../types/blog-post-types";

class BlogPostService {
  private tableName: string;
  private dynamoClient: DynamoDBClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.dynamoClient = new DynamoDBClient({});
  }

  async saveBlogPost(blogPost: IBlogPost): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: applyDynamoDbFormat(blogPost),
    };

    const putCommand = new PutItemCommand(params);
    await this.dynamoClient.send(putCommand);
  }

  async getAllBlogPosts(): Promise<IBlogPost[]> {
    const params = {
      TableName: this.tableName,
    };

    const scanCommand = new ScanCommand(params);
    const scanResponse = await this.dynamoClient.send(scanCommand);
    const items = scanResponse.Items ?? [];

    return items.map((item) => parseDynamoDbFormat(item) as IBlogPost);
  }

  async getBlogPostById(id: string): Promise<IBlogPost | null> {
    const params = {
      TableName: this.tableName,
      Key: applyDynamoDbFormat({ id }),
    };

    const getCommand = new GetItemCommand(params);
    const getResponse = await this.dynamoClient.send(getCommand);
    const item = getResponse.Item;

    if (!item) {
      return null;
    }
    return parseDynamoDbFormat(item) as IBlogPost;
  }
}

const tableName = process.env.TABLE_NAME!;
export const blogPostService = new BlogPostService(tableName);
