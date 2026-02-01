import { Context } from "@avuny/core";
import { OrganizationUserRepository } from "./OrganizationUserRepository.js";
import { CreateOrganizationUserBody } from "./types.js";
import { fail, ok } from "@avuny/utils";
import { OrganizationUserErrorCode } from "./errors/errorCode.js";

export class CreateOrganizationUser {
  constructor(
    private repository: OrganizationUserRepository,
    private config: {
      creationLimit: number;
    },
  ) {}

  execute = async ({
    context,
    data,
  }: {
    context: Context;
    data: CreateOrganizationUserBody;
  }) => {
    let user = await this.repository.findByOrganizationIdAndUserId({
      organizationId: context.organizationId,
      userId: context.organizationId,
    });
    if (user) {
      return fail(
        OrganizationUserErrorCode.USER_EXISTS,
        context,
        "OrganizationUserMutation.create",
      );
    }
    user = await this.repository.findByOrganizationIdAndName({
      organizationId: context.organizationId,
      name: data.name,
    });
    if (user) {
      return fail(
        OrganizationUserErrorCode.MODULE_NAME_CONFLICT,
        context,
        "OrganizationUserMutation.create",
      );
    }

    const count = await this.repository.count({
      where: { organizationId: context.organizationId },
    });
    if (count >= this.config.creationLimit) {
      return fail(
        OrganizationUserErrorCode.MODULE_CREATION_LIMIT_EXCEEDED,
        context,
        "OrganizationUserMutation.create",
      );
    }

    const createdUser = await this.repository.create({
      data: { ...data, organizationId: context.organizationId },
    });

    return ok(createdUser, context, "OrganizationUserMutation.create");
  };
}
