import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { startsWith } from "./utils/startsWith";

const app = new Hono();

app.get("/", async (c) => {
  const targetUrl = c.req.query("src") ?? "";
  const response = await fetch(targetUrl);
  const header = response.headers.get("Content-Type");

  if (!response.ok || !header) {
    c.status(response.status);

    return c.json({
      error: "Image Not Found or Invalid URL",
      message: "Please provide valid image url in src query parameter",
    });
  }

  if (startsWith(header, "image")) {
    c.header(
      "Content-Type",
      response.headers.get("Content-Type") || "application/image"
    );

    return c.body(response.body);
  }

  return c.json({
    error: "Image Not Found or Invalid URL",
    message: "Please provide valid image url in src query parameter",
  });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
