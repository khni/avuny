// src/openapi/endpoint.ts
import { z } from "zod";

import { ErrorResponseSchema } from "./error-schema.js";
import { Context } from "hono";
import { Result } from "../result.js";

export const ErrorCodes = {
  USER_NOT_FOUND: {
    status: 404,
    message: "User not found",
  },
  INVALID_CREDENTIALS: {
    status: 401,
    message: "Invalid credentials",
  },
  ACCOUNT_LOCKED: {
    status: 403,
    message: "Account is locked",
  },
  VALIDATION_ERROR: {
    status: 400,
    message: "Validation error",
  },
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
/**
 * Compile-time enforcement:
 * ServiceErrors MUST be a subset of RouteErrors
 */
type EnforceSubset<
  ServiceErrors extends ErrorCode,
  RouteErrors extends readonly ErrorCode[],
> =
  Exclude<ServiceErrors, RouteErrors[number]> extends never
    ? RouteErrors
    : [
        "❌ Missing route error(s):",
        Exclude<ServiceErrors, RouteErrors[number]>,
      ];

export function createEndpoint<
  ServiceErrors extends ErrorCode,
  RouteErrors extends readonly ErrorCode[],
>(config: {
  request?: z.ZodTypeAny;
  success: z.ZodTypeAny;
  errors: EnforceSubset<ServiceErrors, RouteErrors>;
}) {
  const responses: Record<number, any> = {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: config.success,
        },
      },
    },
  };

  for (const code of config.errors as RouteErrors) {
    const meta = ErrorCodes[code];

    responses[meta.status] ??= {
      description: "Error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema.openapi({
            example: {
              success: false,
              code,
              message: meta.message,
            },
          }),
        },
      },
    };
  }

  return {
    request: config.request
      ? {
          body: {
            content: {
              "application/json": {
                schema: config.request,
              },
            },
          },
        }
      : undefined,
    responses,
  };
}
export function sendError<E>(c: Context, code: E) {
  const meta = ErrorCodes[code];

  return c.json(
    {
      success: false,
      code,
      message: meta.message,
    },
    meta.status
  );
}
