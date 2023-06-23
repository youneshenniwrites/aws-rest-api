export interface IBlogPost {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
}

export type BlogPostPartialType = Omit<IBlogPost, "id" | "createdAt">;
