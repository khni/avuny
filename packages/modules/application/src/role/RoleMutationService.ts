import {
  UpdateService,
  CreateService,
  Context,
  ServiceContext,
} from "@avuny/core";

import { ActivityLogService } from "@avuny/activity-log";
import { RoleRepository } from "@avuny/role";

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

export const createOwnerRole = async (params: {
  context: ServiceContext;
  tx: unknown;
}) => {
  return await createRole.execute({
    data: {
      name: "Owner",
      description: "Owner role with full permissions",
      permissions: [],
      customPermissions: [{ code: "FULL_ACCESS" }],
    },
    ...params,
  });
};
