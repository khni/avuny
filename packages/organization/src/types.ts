import { z } from "@hono/zod-openapi";
import {
  organizationSchema,
  createOrganizationBodySchema,
  updateOrganizationBodySchema,
  getOrganizationByIdSchema,
  organizationQuerySchema,
} from "./schemas.js";

export type Organization = z.infer<typeof organizationSchema>;
export type CreateOrganizationInput = z.infer<
  typeof createOrganizationBodySchema
>;
export type UpdateOrganizationInput = z.infer<
  typeof updateOrganizationBodySchema
>;
export type OrganizationWhereUniqueInput = z.infer<
  typeof getOrganizationByIdSchema
>;
export type OrganizationQueryInput = z.infer<typeof organizationQuerySchema>;
