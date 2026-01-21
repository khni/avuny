import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoleRoute } from "./createRole.route.js";

import { updateRoleRoute } from "./updateRole.route.js";
import { roleListRoute } from "./roleList.route.js";
import { getRoleByIdRoute } from "./getRoleById.route.js";

export const app = new OpenAPIHono();

app.route("/", createRoleRoute);
app.route("/", updateRoleRoute);
app.route("/", roleListRoute);
app.route("/", getRoleByIdRoute);

export { app as RoleRoutes };
