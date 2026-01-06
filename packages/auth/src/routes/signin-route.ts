import { OpenAPIHono } from "@hono/zod-openapi";
import { AuthLoginDomainErrorCodes } from "../lib/auth/errors/errors.js";
import { authLoginErrorMapping } from "../lib/auth/errors/errorsMap.js";
import { createApi, response } from "../lib/hono/createApi.js";
import { createResponseSchema } from "../lib/hono/createResponseSchema.js";
import { createDomainErrorResponseSchema } from "../lib/hono/error-schema.js";
import { authResponseTypeSchema, localLoginInputSchema } from "../schemas.js";
import { refreshTokenCookieOpts } from "../constants.js";
import { setCookie } from "hono/cookie";
import { handleResult } from "../lib/errors.js";
import { signIn } from "../services/UserService.js";

export const signinRoute = new OpenAPIHono();
const route = createApi({
  method: "post",
  operationId: "login",
  path: "/login",
  bodySchema: localLoginInputSchema,
  responses: [
    response(
      200,
      "Auth Response",
      createResponseSchema(authResponseTypeSchema)
    ),
    response(
      authLoginErrorMapping.AUTH_LOGIN_INCORRECT_CREDENTIALS.statusCode,
      "Incorrect Credentials",
      createDomainErrorResponseSchema([
        AuthLoginDomainErrorCodes.AUTH_LOGIN_INCORRECT_CREDENTIALS,
      ])
    ),
    response(
      authLoginErrorMapping.AUTH_LOGIN_USER_PASSWORD_NOT_SET.statusCode,
      "Incorrect Credentials",
      createDomainErrorResponseSchema([
        AuthLoginDomainErrorCodes.AUTH_LOGIN_USER_PASSWORD_NOT_SET,
      ])
    ),
  ],
});

signinRoute.openapi(route, async (c) => {
  const body = c.req.valid("json");
  const result = await signIn(body);
  return handleResult(c, result, authLoginErrorMapping, 200, (data) => {
    const { cookieName, ...rest } = refreshTokenCookieOpts;
    setCookie(c, cookieName, data.tokens.refreshToken, rest);
  });
});
