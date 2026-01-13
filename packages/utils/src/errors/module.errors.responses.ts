import { fail } from "../result.js";
import { ModuleErrorCodes } from "./module.errors.js";

export const nameConflict = () => {
  return fail(ModuleErrorCodes.MODULE_NAME_CONFLICT);
};

export const creationLimitExceeded = () => {
  return fail(ModuleErrorCodes.MODULE_CREATION_LIMIT_EXCEEDED);
};
