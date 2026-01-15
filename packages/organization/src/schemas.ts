import { z } from "@avuny/zod";

export const organizationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(100),
  description: z.string().min(5).max(500).nullable().optional(),
  industryCategoryId: z.string().uuid().nullable().optional(),
  fiscalYearPatternId: z.string().uuid().nullable().optional(),
  stateId: z.uuid(),
  inventoryStartDate: z.coerce.date(),
  ownerId: z.uuid(),
  address: z.string().min(5).max(255).nullable().optional(),
  zipCode: z.string().min(3).max(10).nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export const createOrganizationBodySchema = organizationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});
export const updateOrganizationBodySchema =
  createOrganizationBodySchema.partial();

export const getOrganizationByIdSchema = organizationSchema.pick({ id: true });

export const organizationQuerySchema = z.object({
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
  orderBy: z
    .object({
      name: z.enum(["asc", "desc"]).optional(),
      createdAt: z.enum(["asc", "desc"]).optional(),
    })
    .optional(),
});
