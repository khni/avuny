import {
  authContextHeaderSchema,
  createPaginatedResponseSchema,
  globalErrorResponses,
  requestContextSchema,
} from "@avuny/utils";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { roleListResponseSchema } from "../schemas.js";
import { RoleQueryService } from "../RoleQueryService.js";

import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";

export const roleListRoute = new OpenAPIHono();
const route = createRoute({
  path: "/role",
  method: "get",
  tags: ["role"],

  middleware: [isAuthenticatedMiddleware],
  operationId: "roleList",
  request: {
    headers: authContextHeaderSchema,
  },
  responses: {
    200: {
      description: "Role have been updated successfully",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(roleListResponseSchema),
        },
      },
    },

    ...globalErrorResponses,
  },
});

roleListRoute.openapi(route, async (c) => {
  const service = new RoleQueryService();

  const userId = c.get("user").id;
  const requestId = c.get("requestId");
  const organizationId = c.get("organizationId");
  const context = requestContextSchema.parse({
    userId,
    requestId,
    organizationId,
  });
  const result = await service.filteredPaginatedList({
    context,
    filters: { organizationId: context.organizationId },
  });

  return c.json(result, 200);
});
