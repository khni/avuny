import { ActivityLogService } from "@avuny/activity-log";
import { CreateService, UpdateService } from "@avuny/core";
import {
  CreateOrganiationParams,
  CreateOrganizationBody,
  OrganizationMutationService,
  OrganizationQueryService,
  OrganizationRepository,
  UpdateOrganizationParams,
} from "@avuny/organization";
import { createOwnerRole, createRole } from "../role/RoleMutationService.js";
import { createOwnerOrganizationUser } from "../organization-user/factory.js";

const organizationRepository = new OrganizationRepository();
const activityLog = new ActivityLogService();
export const createOrganization = new CreateService(
  organizationRepository,
  activityLog,
  {
    creationLimit: 3,
    moduleName: "organization",
  },
  [{ keys: ["name", "ownerId"], errorKey: "MODULE_NAME_CONFLICT" as const }],
  {
    afterCreate: async ({ record, ...params }) => {
      const role = await createOwnerRole({ ...params });
      if (role.success) {
        await createOwnerOrganizationUser({
          roleId: role.data.id,
          ...params,
        });
      }
    },
  },
);

export const updateOrganization = new UpdateService(
  organizationRepository,

  {
    moduleName: "organization",
  },
).execute({
  uniqueChecker: [
    { keys: ["name", "ownerId"], errorKey: "MODULE_NAME_CONFLICT" as const },
  ],
  activityLog: activityLog,
});
