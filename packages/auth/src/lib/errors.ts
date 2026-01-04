import { z } from "zod";
import { Result } from "./result.js";
import { ContentfulStatusCode } from "hono/utils/http-status";

export type ErrorMeta = {
  statusCode: number;
  responseMessage: string;
};

export function resultToHttp<T, E extends string>(
  result: Result<T, E>,
  errorMap: Record<E, ErrorMeta>,
  successStatusCode = 200 as const
): {
  status: ContentfulStatusCode;
  body: T | { message: string };
} {
  if (!result.success) {
    const error = errorMap[result.error];

    return {
      status: error.statusCode as ContentfulStatusCode,
      body: { message: error.responseMessage },
    };
  }

  return {
    status: successStatusCode as ContentfulStatusCode,
    body: result.data,
  };
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
