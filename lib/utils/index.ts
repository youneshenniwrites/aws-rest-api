import { IBlogPost } from "../types/blog-post-types";

export function sortBlogPosts(
  blogPosts: IBlogPost[],
  order: string
): IBlogPost[] {
  return blogPosts.sort((blogPostA, blogPostB) => {
    const comparison = blogPostA.createdAt.localeCompare(blogPostB.createdAt);
    return order === "asc" ? comparison : -comparison;
  });
}

export function convertResponseToUTF8(response: Uint8Array): string {
  const buffer = Buffer.from(response);
  return buffer.toString("utf-8");
}
