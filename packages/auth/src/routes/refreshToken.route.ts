import { createApi, handleResult, response } from "@avuny/hono";
import {
  createDomainErrorResponseSchema,
  createResponseSchema,
} from "@avuny/utils";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  authTokensResponseTypeSchema,
  userResponseTypeSchema,
} from "../schemas.js";
import { z } from "@avuny/zod";
import { refreshToken } from "../services/UserService.js";
import { authenticatedErrorMapping } from "../lib/auth/errors/errorsMap.js";
import { AuthenticatedErrorCodes } from "../lib/auth/errors/errors.js";
import { refreshTokenCookieOpts } from "../constants.js";
import { getCookie, setCookie } from "hono/cookie";

export const refreshTokenRoute = new OpenAPIHono();
const route = createApi({
  method: "post",
  operationId: "refreshToken",
  path: "/token/refresh",
  tags: ["auth"],
  bodySchema: z.object({
    token: z.string().optional(),
  }),
  responses: [
    response({
      status: 200,
      description:
        "return new refreshToken and accessToken if refreshToken is valid",
      schema: createResponseSchema(authTokensResponseTypeSchema),
    }),
    response({
      status: 401,
      description: "Token is missing or invalid, user is required to login",
      schema: createDomainErrorResponseSchema([
        AuthenticatedErrorCodes.AUTH_REFRESH_TOKEN_INVALID,
      ]),
    }),
  ],
});

refreshTokenRoute.openapi(route, async (c) => {
  console.log("called refresh token route");
  const body = c.req.valid("json");

  const { cookieName, ...rest } = refreshTokenCookieOpts;
  const token = getCookie(c, cookieName) || body.token;

  const result = await refreshToken({ token });
  console.log("@@RESULT--- api ", result);

  return handleResult(c, result, 200, authenticatedErrorMapping, (data) => {
    setCookie(c, cookieName, data.refreshToken, rest);
  });
});
