import { MiddlewareHandler } from "hono";

import { isAuthenticated } from "../services/UserService.js";

import { resultToErrorResponse } from "@avuny/utils";
import { authenticatedErrorMapping } from "../lib/auth/errors/errorsMap.js";

export const isAuthenticatedMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const result = isAuthenticated(token);
  if (!result.success) {
    return c.json(
      resultToErrorResponse(result.error, authenticatedErrorMapping)
    );
  }

  c.set("user", {
    id: result.data.userId,
  });

  await next();
};
