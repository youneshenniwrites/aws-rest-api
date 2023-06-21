export function createBLogPostHandler() {
  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Hello World" }),
  };
}
