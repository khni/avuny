import { MutationService } from "@avuny/core";
import { RoleRepository } from "./RoleRepository.js";
import { ActivityLogService } from "@avuny/activity-log";

export class RoleMutationService extends MutationService<RoleRepository> {
  constructor() {
    super(new RoleRepository(), new ActivityLogService(), {
      creationLimit: 6,
      moduleName: "role",
    });
  }
}
