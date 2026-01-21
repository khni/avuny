import {
  authContextHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  requestContextSchema,
  resultToResponse,
  resultToSuccessResponse,
} from "@avuny/utils";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  getRoleByIdResponseSchema,
  mutateRoleResponseSchema,
} from "../schemas.js";
import { RoleQueryService } from "../RoleQueryService.js";
import { handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";

export const getRoleByIdRoute = new OpenAPIHono();
const route = createRoute({
  path: "/role/{id}",
  method: "get",
  tags: ["role"],

  middleware: [isAuthenticatedMiddleware],
  operationId: "getRoleById",
  request: {
    headers: authContextHeaderSchema,
    params: getResourceByIdParamsSchema,
  },
  responses: {
    200: {
      description: "Role have been updated successfully",
      content: {
        "application/json": {
          schema: createResponseSchema(
            z.union([getRoleByIdResponseSchema, z.null()]),
          ),
        },
      },
    },

    ...globalErrorResponses,
  },
});

getRoleByIdRoute.openapi(route, async (c) => {
  const service = new RoleQueryService();
  const { id } = c.req.valid("param");
  const userId = c.get("user").id;
  const requestId = c.get("requestId");
  const organizationId = c.get("organizationId");
  const context = requestContextSchema.parse({
    userId,
    requestId,
    organizationId,
  });
  const result = await service.findById({
    context,
    id,
  });

  return c.json(result, 200);
});
