import { UpdateService, CreateService } from "@avuny/core";
import { RoleRepository } from "./RoleRepository.js";
import { ActivityLogService } from "@avuny/activity-log";

export const updateRole = new UpdateService(
  new RoleRepository(),
  new ActivityLogService(),
  { moduleName: "role" },
  [
    {
      keys: ["name", "organizationId"],
      errorKey: "MODULE_NAME_CONFLICT" as const,
    },
  ],
);

export const createRole = new CreateService(
  new RoleRepository(),
  new ActivityLogService(),
  {
    creationLimit: 6,
    moduleName: "role",
  },
  [
    {
      keys: ["name", "organizationId"],
      errorKey: "MODULE_NAME_CONFLICT" as const,
    },
  ],
);
