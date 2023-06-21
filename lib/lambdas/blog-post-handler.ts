import { APIGatewayEvent } from "aws-lambda";
import { BlogPost } from "./BlogPost";

type BlogPostPartial = Omit<BlogPost, "id" | "createdAt">;

export async function createBLogPostHandler(event: APIGatewayEvent) {
  const partialBlogPost: BlogPostPartial = JSON.parse(event.body!);
  return {
    statusCode: 201,
    body: JSON.stringify(partialBlogPost),
  };
}
