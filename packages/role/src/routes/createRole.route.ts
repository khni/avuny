import {
  authContextHeaderSchema,
  createDomainErrorResponseSchema,
  createResponseSchema,
  globalErrorResponses,
  ModuleErrorCodes,
  ModuleErrorResponseMap,
  requestContextSchema,
} from "@avuny/utils";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { createRoleBodySchema, mutateRoleResponseSchema } from "../schemas.js";
import { RoleMutationService } from "../RoleMutationService.js";
import { handleResult } from "@avuny/hono";
import { isAuthenticatedMiddleware } from "@avuny/auth/is-authenticated";
import { Translation } from "../intl/Translation.js";

export const createRoleRoute = new OpenAPIHono();
const route = createRoute({
  path: "/role",
  method: "post",
  tags: ["role"],
  middleware: [isAuthenticatedMiddleware],
  operationId: "createRole",
  request: {
    headers: authContextHeaderSchema,
    body: {
      content: {
        "application/json": {
          schema: createRoleBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Role have been created successfully",
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
    [ModuleErrorResponseMap.MODULE_CREATION_LIMIT_EXCEEDED.statusCode]: {
      description: "Role creation limit has been exceeded",
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

createRoleRoute.openapi(route, async (c) => {
  const lang = c.get("lang");
  const t = new Translation(lang);
  const errorTrans = t.errors;

  const service = new RoleMutationService();
  const body = c.req.valid("json");
  const userId = c.get("user").id;
  const requestId = c.get("requestId");
  const organizationId = c.get("organizationId");
  const context = requestContextSchema.parse({
    userId,
    requestId,
    organizationId,
  });
  const result = await service.create({
    data: body,
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
