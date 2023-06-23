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
