import { OrganizationUserRepository } from "@avuny/organization-user";

import { ActivityLogService } from "@avuny/activity-log";
import { CreateService, ServiceContext, UpdateService } from "@avuny/core";
import { OrganizationUserErrorCode } from "./errors/errorCode.js";

const organizationUserRepository = new OrganizationUserRepository();
const activityLog = new ActivityLogService();
export const createOrganizationUser = new CreateService(
  organizationUserRepository,
  activityLog,
  {
    creationLimit: 3,
    moduleName: "organization",
  },
  [
    {
      keys: ["name", "organizationId"],
      errorKey: OrganizationUserErrorCode.USER_EXISTS,
    },
  ],
);

export const updateOrganizationUser = new UpdateService(
  organizationUserRepository,
  activityLog,
  {
    moduleName: "organization",
  },
  [
    {
      keys: ["organizationId", "userId"],
      errorKey: OrganizationUserErrorCode.USER_EXISTS,
    },
  ],
);

export const createOwnerOrganizationUser = async (params: {
  context: ServiceContext;
  tx: unknown;
  roleId: string;
}) => {
  const user = await createOrganizationUser.execute({
    context: params.context,
    tx: params.tx,
    data: {
      name: "Owner",
      userId: params.context.userId,
      status: "ACTIVE",
      roleId: params.roleId,
    },
  });
};
