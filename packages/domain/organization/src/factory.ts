import { prisma } from "@avuny/db";
import { OrganizationMutationService } from "./OrganizationMutationService.js";
import { OrganizationQueryService } from "./OrganizationQueryService.js";

export const organizationMutationService = new OrganizationMutationService(
  prisma,
  3,
);

export const organizationQueryService = new OrganizationQueryService(prisma);
