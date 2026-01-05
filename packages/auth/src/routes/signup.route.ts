import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import {
  authResponseTypeSchema,
  LocalRegisterInputSchema,
  LocalRegisterWithTransformInputSchema,
} from "../schemas.js";

import { handleResult } from "../lib/errors.js";
import { authSignUpErrorMapping } from "../domain/errorsMap.js";
import { signUp } from "../services/UserService.js";
import { createErrorResponseSchema } from "../lib/hono/error-schema.js";
import { AuthSignUpDomainErrorCodes } from "../domain/errors.js";

import { createResponseSchema } from "../lib/hono/createResponseSchema.js";

export const signupRoute = new OpenAPIHono();
const successStatus = 201;
const userExistsError = authSignUpErrorMapping.AUTH_SIGN_UP_USER_EXIST;

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
      description: "User Signed up in successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(authResponseTypeSchema),
        },
      },
    },
    [userExistsError.statusCode]: {
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
  return handleResult(c, result, authSignUpErrorMapping, successStatus);
  // if (!result.success) {
  //   const err = resultToErrorResponse(result.error, authSignUpErrorMapping);

  //   return c.json(err.body, err.status);
  // }

  // const ok = resultToSuccessResponse(result.data, 201);
  // return c.json(ok.body, ok.status);
});
