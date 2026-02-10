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

const organizationRepository = new OrganizationRepository();
const activityLog = new ActivityLogService();
export const createOrganization = new CreateService(
  organizationRepository,
  activityLog,
  {
    creationLimit: 3,
    moduleName: "organization",
  },
  [{ keys: ["name", "ownerId"], errorKey: "MODULE_NAME_CONFLICT" }],
);

export const updateOrganization = new UpdateService(
  organizationRepository,
  activityLog,
  {
    moduleName: "organization",
  },
  [{ keys: ["name", "ownerId"], errorKey: "MODULE_NAME_CONFLICT" }],
);
