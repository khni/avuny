import { QueryService } from "@avuny/core";
import { RoleRepository } from "./RoleRepository.js";

export class RoleQueryService extends QueryService<RoleRepository> {
  constructor() {
    super(new RoleRepository(), { moduleName: "role" });
  }
}
