
import { ErrorMeta } from "../types.js";
import { ModuleErrorCode, ModuleErrorCodes } from "./module.errors.js";
export const ModuleErrorResponseMap = {
  [ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED]: {
    statusCode: 403, // or 429 if this is rate/quota based
    responseMessage: {en:"Module creation limit exceeded" ,ar: }
  },
  [ModuleErrorCodes.MODULE_NAME_CONFLICT]: {
    statusCode: 409,
    responseMessage: "Module name already exists",
  },

  // NEW
  [ModuleErrorCodes.USER_NO_PERMISSION]: {
    statusCode: 403,
    responseMessage: "User has no permission",
  },
} as const satisfies Record<ModuleErrorCode, ErrorMeta>;

const moduleErrors  = (
  MODULE_CREATION_LIMIT_EXCEEDED:(thing:string)=> `You have reached the maximum number of creating more {thing} allowed in your plan. Please upgrade your plan to create more ${thing}.`
)