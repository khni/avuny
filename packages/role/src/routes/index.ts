import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoleRoute } from "./createRole.route.js";

import { updateRoleRoute } from "./updateRole.route.js";

export const app = new OpenAPIHono();

app.route("/", createRoleRoute);
app.route("/", updateRoleRoute);

export { app as RoleRoutes };
