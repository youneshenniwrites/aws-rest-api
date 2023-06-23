import { APIGatewayEvent } from "aws-lambda";
import { BlogPostPartialType, IBlogPost } from "../types/blog-post-types";
import { v4 as uuid } from "uuid";
import { blogPostService } from "../services/blog-post-service";

export async function createBLogPostHandler(event: APIGatewayEvent) {
  const partialBlogPost: BlogPostPartialType = JSON.parse(event.body!);

  //* Add missing fields
  const id = uuid();
  const createdAt = new Date().toISOString();
  const blogPost: IBlogPost = { id, ...partialBlogPost, createdAt };

  //* Save blog post to db
  await blogPostService.saveBlogPost(blogPost);

  return {
    statusCode: 201,
    body: JSON.stringify(blogPost),
  };
}
