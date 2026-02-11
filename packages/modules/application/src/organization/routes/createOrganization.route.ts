import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  requestContextSchema,
} from "@avuny/utils";
import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";

import { handleResult } from "@avuny/hono";

import { Translation } from "../intl/Translation.js";
import {
  createOrganizationBodySchema,
  mutateOrganizationResponseSchema,
} from "@avuny/organization/schemas";
import { createOrganization } from "../factory.js";

export const createOrganizationRoute = new OpenAPIHono();
const route = createRoute({
  method: "post",
  path: "/organizations",
  operationId: "createOrganization",
  tags: ["organization"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    body: {
      content: {
        "application/json": {
          schema: createOrganizationBodySchema,
        },
      },
    },
  },

  responses: {
    [201]: {
      description: "Organization have been created successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(mutateOrganizationResponseSchema),
        },
      },
    },
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "Organization name is not unique",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_NAME_CONFLICT,
          ]),
        },
      },
    },
    [ModuleErrorResponseMap.MODULE_CREATION_LIMIT_EXCEEDED.statusCode]: {
      description: "Organization creation limit has been exceeded",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED,
          ]),
        },
      },
    },
    ...globalErrorResponses,
  },
});

createOrganizationRoute.openapi(route, async (c) => {
  const lang = c.get("lang");
  const t = new Translation(lang);
  const errorTrans = t.errors;

  const body = c.req.valid("json");
  const user = c.get("user");

  const userId = c.get("user").id;
  const requestId = c.get("requestId");
  const organizationId = c.get("organizationId");
  const context = requestContextSchema.parse({
    userId,
    requestId,
    organizationId,
  });

  const result = await createOrganization.execute({
    data: { ...body, ownerId: user.id },
    context,
  });
  return handleResult({
    c,
    result,
    successStatus: 201,
    errorMap: ModuleErrorResponseMap,
    errorTrans,
  });
});
