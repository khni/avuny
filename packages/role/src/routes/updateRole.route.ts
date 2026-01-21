import {
  authContextHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  requestContextSchema,
} from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { updateRoleBodySchema, mutateRoleResponseSchema } from "../schemas.js";
import { RoleMutationService } from "../RoleMutationService.js";
import { handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";

export const updateRoleRoute = new OpenAPIHono();
const route = createRoute({
  path: "/role/{id}",
  method: "put",
  tags: ["role"],

  middleware: [isAuthenticatedMiddleware],
  operationId: "updateRole",
  request: {
    headers: authContextHeaderSchema,
    params: getResourceByIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateRoleBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Role have been updated successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(mutateRoleResponseSchema),
        },
      },
    },
    [ModuleErrorResponseMap.MODULE_NAME_CONFLICT.statusCode]: {
      description: "Role name is not unique",
      content: {
        "application/json": {
          schema: createDomainErrorResponseSchema([
            ModuleErrorCodes.MODULE_NAME_CONFLICT,
          ]),
        },
      },
    },

    ...globalErrorResponses,
  },
});

updateRoleRoute.openapi(route, async (c) => {
  const service = new RoleMutationService();
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const userId = c.get("user").id;
  const requestId = c.get("requestId");
  const organizationId = c.get("organizationId");
  const context = requestContextSchema.parse({
    userId,
    requestId,
    organizationId,
  });
  const result = await service.update({
    data: body,
    context,
    id,
  });
  return handleResult(c, result, 200, {
    MODULE_NAME_CONFLICT: ModuleErrorResponseMap.MODULE_NAME_CONFLICT,
  });
});
