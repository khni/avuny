import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";
import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";
import { OrganizationMutationService } from "../OrganizationMutationService.js";
import { prisma } from "@avuny/db";
import { handleResult } from "@avuny/hono";
import {
  mutateOrganizationResponseSchema,
  organizationSchema,
  updateOrganizationBodySchema,
} from "../schemas.js";

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
          schema: updateOrganizationBodySchema,
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
  },
  ...globalErrorResponses,
});

updateOrganizationRoute.openapi(route, async (c) => {
  const { id } = c.req.valid("param");
  const service = new OrganizationMutationService(prisma);
  const body = c.req.valid("json");
  const user = c.get("user");

  const result = await service.update({
    data: body,
    ownerId: user.id,
    where: { id },
  });
  return handleResult({
    c,
    result,
    successStatus: 200,
    errorMap: {
      MODULE_NAME_CONFLICT: ModuleErrorResponseMap.MODULE_NAME_CONFLICT,
    },
  });
});
