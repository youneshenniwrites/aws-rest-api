import { APIGatewayEvent } from "aws-lambda";
import { BlogPost } from "./BlogPost";
import { v4 as uuid } from "uuid";

type BlogPostPartial = Omit<BlogPost, "id" | "createdAt">;

export async function createBLogPostHandler(event: APIGatewayEvent) {
  const partialBlogPost: BlogPostPartial = JSON.parse(event.body!);

  // Add missing fields
  const id = uuid();
  const createdAt = new Date().toISOString();
  const blogPost: BlogPost = { id, ...partialBlogPost, createdAt };

  return {
    statusCode: 201,
    body: JSON.stringify(blogPost),
  };
}
