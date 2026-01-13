import { OpenAPIHono } from "@hono/zod-openapi";
import { createOrganizationRoute } from "./createOrganization.route.js";

export const app = new OpenAPIHono();

app.route("/", createOrganizationRoute);

export { app as OrganizationRoutes };
