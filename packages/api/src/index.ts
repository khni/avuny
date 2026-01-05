import { AuthRoutes } from "@avuny/auth";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { onError } from "./onError.js";
export * from "@avuny/auth/schemas";
// import { createHonoErrorHandler } from "@khni/error-handler";
// const errorHandler = createHonoErrorHandler(console);
export const app = new OpenAPIHono().basePath("/api");
app.route("/auth", AuthRoutes);

// app.use(errorHandler);
app.onError(onError);
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: { title: "IMS API", version: "1.0.0" },
});

app.get("/docs", swaggerUI({ url: "/api/openapi.json" }));

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: { title: "IMS API", version: "1.0.0" },
});

app.get("/docs", swaggerUI({ url: "/openapi.json" }));
