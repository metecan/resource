import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { isValidUrl } from "./utils/isValidUrl";
import { startsWith } from "./utils/startsWith";

const app = new Hono();
const port = Number(process.env.PORT || 3030);

app.get("/", async (c) => {
  const targetUrl = c.req.query("src") ?? "";

  if (targetUrl !== "" && isValidUrl(targetUrl)) {
    const response = await fetch(targetUrl);
    const header = response.headers.get("Content-Type");

    if (!response.ok || !header || targetUrl === undefined) {
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
  }

  c.status(400);
  return c.json({
    error: "Image Not Found or Invalid URL",
    message: "Please provide valid image url in src query parameter",
  });
});

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
