import { UpdateService, CreateService, Context } from "@avuny/core";

import { ActivityLogService } from "@avuny/activity-log";
import { RoleRepository } from "@avuny/role";

export const updateRole = new UpdateService(
  new RoleRepository(),

  { moduleName: "role" },
).execute({
  uniqueChecker: [
    {
      keys: ["name", "organizationId"],
      errorKey: "MODULE_NAME_CONFLICT" as const,
    },
  ],
  activityLog: new ActivityLogService(),
});

export const createRole = new CreateService(
  new RoleRepository(),

  {
    creationLimit: 6,
    moduleName: "role",
  },
).execute({
  uniqueChecker: [
    {
      keys: ["name", "organizationId"],
      errorKey: "MODULE_NAME_CONFLICT" as const,
    },
  ],
  activityLog: new ActivityLogService(),
});

export const createOwnerRole = async (params: {
  context: Context;
  tx: unknown;
}) => {
  return await createRole({
    data: {
      name: "Owner",
      description: "Owner role with full permissions",
      permissions: [],
      customPermissions: [{ code: "FULL_ACCESS" }],
    },
    ...params,
  });
};
