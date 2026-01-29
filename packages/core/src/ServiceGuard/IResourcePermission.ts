import { Action, Resource } from "../types.js";

export interface IResourcePermission {
  check(params: {
    organizationId: string;
    userId: string;
    resource: Resource;
    action: Action;
  }): Promise<boolean>;
}
