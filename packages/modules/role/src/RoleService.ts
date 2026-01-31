import { RoleRepository } from "./RoleRepository.js";
import { ActivityLogService } from "@avuny/activity-log";
import { CreateRoleBody, UpdateRoleBody } from "./types.js";
import { creationLimitExceeded, nameConflict, ok } from "@avuny/utils";
import { Action, Resource } from "@avuny/db/types";

interface AccessControl {
  hasAccess(params: {
    resourceType: Resource;
    action: Action;
    userId: string;
    organizationId: string;
  }): Promise<boolean>;
}
export class RoleMutationService {
  constructor(
    private creationLimit: number = 8,
    private repository: RoleRepository = new RoleRepository(),
    private activityLog: ActivityLogService = new ActivityLogService(),
    private accessControl: AccessControl,
  ) {}

  create = async (params: {
    data: CreateRoleBody;
    context: { userId: string; requestId: string; organizationId: string };
  }) => {
    const { data, context } = params;
    const existsRole = await this.repository.findUnique({
      where: {
        organizationId_name: {
          name: data.name,
          organizationId: context.organizationId,
        },
      },
    });
    if (existsRole) {
      return nameConflict(context, "RoleService.create");
    }
    const rolesCount = await this.repository.count({
      where: {
        organizationId: context.organizationId,
      },
    });
    if (rolesCount >= this.creationLimit) {
      return creationLimitExceeded(context, "RoleService.create");
    }
    const role = await this.repository.createTransaction(async (tx) => {
      const role = await this.repository.create({
        data: { ...data, organizationId: context.organizationId },
        tx,
      });
      await this.activityLog.create({
        tx,
        data: {
          event: "create",
          organizationId: context.organizationId,
          resourceId: role.id,
          resourceType: "role",
        },
      });
      return role;
    });
    return ok(role, context, "RoleMutationService.create");
  };

  update = async (params: {
    data: UpdateRoleBody;
    id: string;
    context: { userId: string; requestId: string; organizationId: string };
  }) => {
    const { data, context, id } = params;
    if (data.name) {
      const existsRole = await this.repository.findUnique({
        where: {
          organizationId_name: {
            name: data.name,
            organizationId: context.organizationId,
          },
        },
      });
      if (existsRole && existsRole.id != id) {
        return nameConflict(context, "RoleService.update");
      }
    }

    const role = await this.repository.createTransaction(async (tx) => {
      const role = await this.repository.update({
        data,
        where: {
          id,
        },
        tx,
      });
      await this.activityLog.create({
        tx,
        data: {
          event: "create",
          organizationId: context.organizationId,
          resourceId: role.id,
          resourceType: "role",
        },
      });
      return role;
    });
    return ok(role, context, "RoleMutationService.create");
  };
}
