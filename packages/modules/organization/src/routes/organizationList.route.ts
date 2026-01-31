import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";
import {
  AuthorizationHeaderSchema,
  createResponseSchema,
  globalErrorResponses,
  resultToSuccessResponse,
} from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  organizationListResponseSchema,
  organizationSchema,
} from "../schemas.js";
import { prisma } from "@avuny/db";
import { OrganizationQueryService } from "../OrganizationQueryService.js";

export const organizationListRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/organizations",
  operationId: "organizationList",
  tags: ["organization"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    headers: AuthorizationHeaderSchema,
  },
  responses: {
    200: {
      description: "User Organization List retrieved successfully.",
      content: {
        "application/json": {
          schema: createResponseSchema(organizationListResponseSchema.array()),
        },
      },
    },
    ...globalErrorResponses,
  },
});

organizationListRoute.openapi(route, async (c) => {
  const service = new OrganizationQueryService(prisma);

  const user = c.get("user");

  const result = await service.findMany({
    ownerId: user.id,
  });

  const res = resultToSuccessResponse(result, 200);
  return c.json(res.body, 200);
});
