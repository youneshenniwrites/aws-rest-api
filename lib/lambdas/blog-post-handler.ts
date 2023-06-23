import { APIGatewayEvent } from "aws-lambda";
import { BlogPostPartialType, IBlogPost } from "../types/blog-post-types";
import { v4 as uuid } from "uuid";
import { blogPostService } from "../services/blog-post-service";
import { sortBlogPosts } from "../utils";

export async function createBlogPostHandler(event: APIGatewayEvent) {
  const partialBlogPost: BlogPostPartialType = JSON.parse(event.body!);

  const id = uuid();
  const createdAt = new Date().toISOString();

  //* Add missing fields
  const blogPost: IBlogPost = { id, ...partialBlogPost, createdAt };

  //* Save blog post to db
  await blogPostService.saveBlogPost(blogPost);

  return {
    statusCode: 201,
    body: JSON.stringify(blogPost),
  };
}

export async function getBlogPostsHandler(event: APIGatewayEvent) {
  const order = event?.queryStringParameters?.order;
  let blogPosts = await blogPostService.getAllBlogPosts();

  blogPosts = sortBlogPosts(blogPosts, order || "desc");

  return {
    statusCode: 200,
    body: JSON.stringify(blogPosts),
  };
}
