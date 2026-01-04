import { AuthError, authErrorMapping } from "@khni/auth-errors";
import { errorMapper } from "@khni/error-handler";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";
import {
  authResponseTypeSchema,
  localLoginInputSchema,
  LocalRegisterInputSchema,
  LocalRegisterWithTransformInputSchema,
} from "../schemas.js";

import { refreshTokenCookieOpts } from "../constants.js";
import { signUp } from "../services/UserService.js";
import { resultToHttp } from "../lib/errors.js";
import { authLoginErrorMapping } from "../domain/errorsMap.js";
export const loginRoute = new OpenAPIHono();
const route = createRoute({
  method: "post",
  operationId: "login",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LocalRegisterInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User logged in successfully",
      content: {
        "application/json": {
          schema: authResponseTypeSchema,
        },
      },
    },
    401: {
      description: "Invalid credentials",
    },
  },
});

loginRoute.openapi(route, async (c) => {
  const body = c.req.valid("json");
  const bodyWithIndentifierType =
    LocalRegisterWithTransformInputSchema.parse(body);

  try {
    const result = await signUp(bodyWithIndentifierType);
    const http = resultToHttp(result, authLoginErrorMapping);

    return c.json(http.body, http.status);

    // Extract cookie settings
    const { cookieName, ...rest } = refreshTokenCookieOpts;

    // Set refresh token cookie
    setCookie(c, cookieName, result.tokens.refreshToken, rest);

    return c.json(result, 200);
  } catch (error) {
    if (error instanceof AuthError) {
      throw errorMapper(error, authErrorMapping);
    }
    throw error;
  }
});
