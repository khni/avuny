import {
  ActionName,
  OrganizationUserStatus,
  ResourceName,
  SystemCustomPermission,
} from "@avuny/db/enums";
import { z } from "@avuny/zod";

export const organizationUserSchema = z.object({
  id: z.string().uuid(),

  userId: z.uuid(),
  name: z.string().min(1),

  roleId: z.uuid(),
  organizationId: z.uuid(),

  status: z.enum(OrganizationUserStatus),
  expiresAt: z.date().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

// body schemas
export const mutateOrganizationUserSchema = organizationUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  organizationId: true,
  expiresAt: true,
});

export const createOrganizationUserBodySchema = mutateOrganizationUserSchema;

// params schema
export const updateOrganizationUserBodySchema =
  mutateOrganizationUserSchema.partial();

export const getOrganizationUserByIdSchema = organizationUserSchema.pick({
  id: true,
});

// Response schemas
export const mutateOrganizationUserResponseSchema = organizationUserSchema.pick(
  {
    id: true,
    name: true,
  },
);

export const organizationUserListResponseSchema = organizationUserSchema
  .pick({
    id: true,
    name: true,

    updatedAt: true,
  })
  .array();

export const getOrganizationUserByIdResponseSchema =
  organizationUserSchema.pick({
    id: true,
    name: true,
  });
