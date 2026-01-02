import { AuthError, authErrorMapping } from "@khni/auth-errors";
import { errorMapper } from "@khni/error-handler";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";
import {
  authResponseTypeSchema,
  localRegisterInputSchema,
} from "../schemas.js";
import { authService } from "../services/index.js";
import { refreshTokenCookieOpts } from "../constants.js";
export const signupRoute = new OpenAPIHono();
const successStatus = 201;
const route = createRoute({
  method: "post",
  path: "/sign-up",
  operationId: "signUp",
  request: {
    body: {
      content: {
        "application/json": {
          schema: localRegisterInputSchema,
        },
      },
    },
  },
  responses: {
    [successStatus]: {
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

signupRoute.openapi(route, async (c) => {
  const body = c.req.valid("json");

  try {
    const result: z.infer<typeof authResponseTypeSchema> =
      await authService.register({ data: body });

    // Extract cookie settings
    const { cookieName, ...rest } = refreshTokenCookieOpts;

    // Set refresh token cookie
    setCookie(c, cookieName, result.tokens.refreshToken, rest);

    return c.json(result, successStatus);
  } catch (error) {
    if (error instanceof AuthError) {
      throw errorMapper(error, authErrorMapping);
    }
    throw error;
  }
});
