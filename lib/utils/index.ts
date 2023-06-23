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

export function getSwaggerUIHtml() {
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="SwaggerUI"
      />
      <title>SwaggerUI</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
    </head>
    <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: 'api-docs',
          dom_id: '#swagger-ui',
        });
      };
    </script>
    </body>
    </html>`;

  return html;
}
