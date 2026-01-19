import { z } from "@avuny/zod";

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isSystem: z.boolean(),
  priority: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date().nullable(),
  organizationId: z.string(),
});

// body schemas
export const mutateRoleSchema = roleSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    organizationId: true,
  })
  .extend({
    permissions: z
      .object({
        permissionId: z.uuid(),
      })
      .array(),
  });
export const createRoleBodySchema = mutateRoleSchema;

// params schema
export const updateRoleBodySchema = mutateRoleSchema.partial();

export const getRoleByIdSchema = roleSchema.pick({ id: true });

// Response schemas
export const mutateRoleResponseSchema = roleSchema.pick({
  id: true,
  name: true,
});

export const roleListResponseSchema = roleSchema.pick({
  id: true,
  name: true,
  description: true,
  updatedAt: true,
});

export const getRoleByIdResponseSchema = roleSchema;
