// src/openapi/error-schema.ts
import { z } from "zod";

import { AuthDomainErrorCodes } from "../../domain/errors.js";

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  code: z.enum(AuthDomainErrorCodes),
  message: z.string(),
});

export const createErrorResponseSchema = (errorCodes: string[]) => {
  return z.object({
    success: z.literal(false),
    code: z.enum(errorCodes),
    message: z.string(),
  });
};
