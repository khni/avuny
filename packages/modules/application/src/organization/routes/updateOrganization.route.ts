import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  requestContextSchema,
} from "@avuny/utils";
import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";

import { handleResult } from "@avuny/hono";

import { Translation } from "../intl/Translation.js";
import {
  updateOrganizationBodySchema,
  mutateOrganizationResponseSchema,
  mutateOrganizationSchema,
} from "@avuny/organization/schemas";
import { updateOrganization } from "../factory.js";

export const updateOrganizationRoute = new OpenAPIHono();
const route = createRoute({
  method: "put",
  path: "/organizations/{id}",
  operationId: "updateOrganization",
  tags: ["organization"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: mutateOrganizationSchema,
        },
      },
    },
  },

  responses: {
    [200]: {
      description: "Organization have been updated successfully",
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

updateOrganizationRoute.openapi(route, async (c) => {
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
  const { id } = c.req.valid("param");

  const result = await updateOrganization({
    data: { ...body, ownerId: user.id },
    context,
    id,
  });
  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: ModuleErrorResponseMap,
    errorTrans,
  });
});
