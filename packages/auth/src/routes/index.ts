import { OpenAPIHono } from "@hono/zod-openapi";
// import { loginRoute } from "./login.route.js";
import { signupRoute } from "./signup.route.js";

export const app = new OpenAPIHono();

// app.route("", loginRoute);
app.route("", signupRoute);

export { app as AuthRoutes };
