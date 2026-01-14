import { OpenAPIHono } from "@hono/zod-openapi";
import { createOrganizationRoute } from "./createOrganization.route.js";
import { organizationListRoute } from "./organizationList.route.js";
import { getOrganizationByIdRoute } from "./getOrganizationById.route.js";
import { updateOrganizationRoute } from "./updateOrganization.route.js";

export const app = new OpenAPIHono();

app.route("/", createOrganizationRoute);
app.route("/", organizationListRoute);
app.route("/", getOrganizationByIdRoute);
app.route("/", updateOrganizationRoute);

export { app as OrganizationRoutes };
