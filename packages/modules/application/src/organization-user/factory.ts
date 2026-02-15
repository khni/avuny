import { OrganizationUserRepository } from "@avuny/organization-user";

import { ActivityLogService } from "@avuny/activity-log";
import { ServiceContext, CreateService, UpdateService } from "@avuny/core";
import { OrganizationUserErrorCode } from "./errors/errorCode.js";

const organizationUserRepository = new OrganizationUserRepository();
const activityLog = new ActivityLogService();
export const createOrganizationUser = new CreateService(
  organizationUserRepository,

  {
    creationLimit: 3,
    moduleName: "organization",
  },
).create({
  uniqueChecker: [
    {
      keys: ["organizationId", "userId"],
      errorKey: OrganizationUserErrorCode.USER_EXISTS,
    },
  ],
  activityLog: activityLog,
});

export const updateOrganizationUser = new UpdateService(
  organizationUserRepository,
  {
    moduleName: "organization",
  },
).update({
  uniqueChecker: [
    {
      keys: ["organizationId", "userId"],
      errorKey: OrganizationUserErrorCode.USER_EXISTS,
    },
  ],
  activityLog: activityLog,
});

export const createOwnerOrganizationUser = async (params: {
  context: ServiceContext;
  tx: unknown;
  roleId: string;
}) => {
  const user = await createOrganizationUser({
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
