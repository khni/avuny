import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  createOrganizationBodySchema,
  organizationSchema,
} from "../schemas.js";
import {
  AuthorizationHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
} from "@avuny/utils";
import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";
import { OrganizationMutationService } from "../OrganizationMutationService.js";
import { prisma } from "@avuny/db";
import { handleResult } from "@avuny/hono";
import { app } from "./index.js";

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
          schema: createResponseSchema(organizationSchema),
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
  },
  ...globalErrorResponses,
});

createOrganizationRoute.openapi(route, async (c) => {
  const service = new OrganizationMutationService(prisma);
  const body = c.req.valid("json");
  const user = c.get("user");

  const result = await service.create({
    data: body,
    ownerId: user.id,
  });
  return handleResult(c, result, 201, ModuleErrorResponseMap);
});
