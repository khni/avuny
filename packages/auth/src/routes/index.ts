import { OpenAPIHono } from "@hono/zod-openapi";
import { signupRoute } from "./signup.route.js";
import { signinRoute } from "./signin.route.js";

export const app = new OpenAPIHono();

app.route("", signinRoute);
app.route("", signupRoute);

export { app as AuthRoutes };
