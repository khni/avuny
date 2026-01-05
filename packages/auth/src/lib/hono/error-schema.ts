// src/openapi/error-schema.ts
import { z } from "zod";

import { AuthDomainErrorCodes } from "../auth/errors/errors.js";

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  code: z.enum(AuthDomainErrorCodes),
  message: z.string(),
});

export const createDomainErrorResponseSchema = (errorCodes: string[]) => {
  return z.object({
    type: z.string("domain"),
    success: z.literal(false),
    code: z.enum(errorCodes),
    message: z.string(),
  });
};
