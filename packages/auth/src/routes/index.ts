import { OpenAPIHono } from "@hono/zod-openapi";
import { signupRoute } from "./signUp.route.js";
import { signinRoute } from "./signIn.route.js";
import { isAutenticatedRoute } from "./isAuthenticated.route.js";

export const app = new OpenAPIHono();

app.route("", signinRoute);
app.route("", signupRoute);
app.route("", isAutenticatedRoute);

export { app as AuthRoutes };
