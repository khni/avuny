import { AuthError, authErrorMapping } from "@khni/auth-errors";
import { errorMapper } from "@khni/error-handler";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";
import {
  authResponseTypeSchema,
  LocalRegisterInputSchema,
  LocalRegisterWithTransformInputSchema,
} from "../schemas.js";

import { refreshTokenCookieOpts } from "../constants.js";
import { mapErrorsToResponses, resultToHttp } from "../lib/errors.js";
import { authSignUpErrorMapping } from "../domain/errorsMap.js";
import { signUp } from "../services/UserService.js";
import { createErrorResponseSchema } from "../lib/hono/error-schema.js";
import { AuthSignUpDomainErrorCodes } from "../domain/errors.js";
import { json } from "zod";
import { handleResult } from "../lib/hono/handleResult.js";
export const signupRoute = new OpenAPIHono();
const successStatus = 201;
const signUpErrorResponses = mapErrorsToResponses(authSignUpErrorMapping);
const route = createRoute({
  method: "post",
  path: "/sign-up",
  operationId: "signUp",
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
    [successStatus]: {
      description: "User logged in successfully",
      content: {
        "application/json": {
          schema: authResponseTypeSchema,
        },
      },
    },
    [authSignUpErrorMapping.AUTH_SIGN_UP_USER_EXIST.statusCode]: {
      description: "User is exist with same identifier",
      content: {
        "application/json": {
          schema: createErrorResponseSchema([
            AuthSignUpDomainErrorCodes.AUTH_SIGN_UP_USER_EXIST,
          ]),
        },
      },
    },
  },
});

signupRoute.openapi(route, async (c) => {
  const body = c.req.valid("json");

  const bodyWithIndentifierType =
    LocalRegisterWithTransformInputSchema.parse(body);

  const result = await signUp(bodyWithIndentifierType);
  const http = resultToHttp(result, authSignUpErrorMapping);
  return handleResult(c, result);
  // if (result.success) {
  //   return c.json(result.data, 201);
  // } else {
  //   return c.json({ code: result.error, message: "", success: false }, 409);
  // }
});
