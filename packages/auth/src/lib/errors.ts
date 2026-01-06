import { z } from "zod";

import {
  ClientErrorStatusCode,
  ContentfulStatusCode,
} from "hono/utils/http-status";
import { Context } from "hono";
import { Result } from "@avuny/utils";

export type ErrorMeta = {
  statusCode: ClientErrorStatusCode;
  responseMessage: string;
};

export function resultToResponse<T, E extends string>(
  result: Result<T, E>,
  errorMap: Record<E, ErrorMeta>,
  successStatusCode = 200
) {
  if (!result.success) {
    const errorCode = result.error;
    //
    const error = errorMap[errorCode];

    return {
      status: error.statusCode as ContentfulStatusCode,
      body: {
        success: false as const,
        code: errorCode,
        message: error.responseMessage,
      },
    };
  }

  return {
    status: successStatusCode as ContentfulStatusCode,
    body: { success: true as const, data: result.data },
  };
}

export function resultToErrorResponse<E extends string, S extends number>(
  error: E,
  errorMap: Record<E, { statusCode: S; responseMessage: string }>
) {
  const meta = errorMap[error];

  return {
    status: meta.statusCode,
    body: {
      success: false as const,
      code: error,
      message: meta.responseMessage,
      type: "domain",
    },
  };
}

export function resultToSuccessResponse<T, S extends number>(
  data: T,
  status: S
) {
  return {
    status,
    body: {
      success: true as const,
      data,
    },
  };
}

export function handleResult<
  T,
  E extends string,
  S extends ContentfulStatusCode,
  SE extends ClientErrorStatusCode,
>(
  c: Context,
  result: Result<T, E>,
  errorMap: Record<E, { statusCode: SE; responseMessage: string }>,
  successStatus: S,
  onSuccess?: (result: T) => void,
  onError?: (error: E) => void
) {
  if (!result.success) {
    const err = resultToErrorResponse(result.error, errorMap);
    onError?.(result.error);
    // ❗ critical: return directly from c.json
    return c.json(err.body, err.status);
  }
  onSuccess?.(result.data);

  const ok = resultToSuccessResponse(result.data, successStatus);
  return c.json(ok.body, ok.status);
}

const ErrorResponseSchema = z.object({
  message: z.string(),
});

export function mapErrorsToResponses<
  T extends Record<string, { statusCode: number; responseMessage: string }>,
>(errorMap: T) {
  const responses: Record<number, any> = {};

  for (const error of Object.values(errorMap)) {
    responses[error.statusCode] ??= {
      description: "Error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
          example: { message: error.responseMessage },
        },
      },
    };
  }

  return responses;
}
