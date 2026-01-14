import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";
import {
  AuthorizationHeaderSchema,
  createResponseSchema,
  getResourceByIdParamsSchema,
  globalErrorResponses,
  resultToSuccessResponse,
} from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { organizationSchema } from "../schemas.js";
import { prisma } from "@avuny/db";
import { OrganizationQueryService } from "../OrganizationQueryService.js";
import { z } from "@avuny/zod";

export const getOrganizationByIdRoute = new OpenAPIHono();
const route = createRoute({
  method: "get",
  path: "/organizations/{id}",
  operationId: "getOrganizationById",
  tags: ["organization"],
  middleware: [isAuthenticatedMiddleware],
  request: {
    params: getResourceByIdParamsSchema,
    headers: AuthorizationHeaderSchema,
  },
  responses: {
    200: {
      description: "Organization retrieved successfully by ID",
      content: {
        "application/json": {
          schema: createResponseSchema(z.union([organizationSchema, z.null()])),
        },
      },
    },
    ...globalErrorResponses,
  },
});

getOrganizationByIdRoute.openapi(route, async (c) => {
  const { id } = c.req.valid("param");
  const service = new OrganizationQueryService(prisma);

  const user = c.get("user");

  const result = await service.findUnique({
    ownerId: user.id,
    where: { id },
  });

  const res = resultToSuccessResponse(result, 200);
  return c.json(res.body, res.status);
});
