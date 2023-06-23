import { APIGatewayEvent } from "aws-lambda";
import { BlogPostPartialType, IBlogPost } from "../types/blog-post-types";
import { v4 as uuid } from "uuid";
import { blogPostService } from "../services/blog-post-service";
import { convertResponseToUTF8, sortBlogPosts } from "../utils";
import {
  APIGatewayClient,
  GetExportCommand,
} from "@aws-sdk/client-api-gateway";
import { apiDocsService } from "../services/api-docs-service";

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

export async function getBlogPostHandler(event: APIGatewayEvent) {
  const id = event.pathParameters!.id!;
  const blogPost = await blogPostService.getBlogPostById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(blogPost),
  };
}

export async function deleteBlogPostHandler(event: APIGatewayEvent) {
  const id = event.pathParameters!.id!;
  await blogPostService.deleteBlogPostById(id);

  return {
    statusCode: 204,
  };
}

export async function apiDocsHandler(event: APIGatewayEvent) {
  const apiDocs = await apiDocsService.getApiDocs();

  return {
    statusCode: 204,
    body: convertResponseToUTF8(apiDocs.body!),
  };
}
