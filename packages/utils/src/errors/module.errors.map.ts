import { ErrorMeta } from "../response.js";
import { ModuleErrorCode, ModuleErrorCodes } from "./module.errors.js";

export const ModuleErrorResponseMap = {
  [ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 403, // or 429 if this is rate/quota based
    responseMessage: "Module creation limit exceeded",
  },
  [ModuleErrorCodes.MODULE_NAME_CONFLICT]: {
    statusCode: 409,
    responseMessage: "Module name already exists",
  },
} as const satisfies Record<ModuleErrorCode, ErrorMeta>;
