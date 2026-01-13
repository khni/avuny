export const ModuleErrorCodes = {
  MODULE_CREATION_LIMIT_EXCEEDED: "MODULE_CREATION_LIMIT_EXCEEDED",
  MODULE_NAME_CONFLICT: "MODULE_NAME_CONFLICT",
} as const;

export type ModuleErrorCode =
  (typeof ModuleErrorCodes)[keyof typeof ModuleErrorCodes];
