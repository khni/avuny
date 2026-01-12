import { z } from "@avuny/zod";

export const organizationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(100),
  description: z.string().min(5).max(500).nullable(),
  industryCategoryId: z.string().uuid().nullable(),
  fiscalYearPatternId: z.string().uuid().nullable(),
  stateId: z.uuid(),
  inventoryStartDate: z.coerce.date(),
  ownerId: z.uuid(),
  address: z.string().min(5).max(255).nullable(),
  zipCode: z.string().min(3).max(10).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export const createOrganizationSchema = organizationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateOrganizationSchema = createOrganizationSchema
  .omit({ ownerId: true })
  .partial();

export const organizationWhereUniqueSchema = z.object({
  id: z.uuid(),
});

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
export type Organization = z.infer<typeof organizationSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type OrganizationWhereUniqueInput = z.infer<
  typeof organizationWhereUniqueSchema
>;
export type OrganizationQueryInput = z.infer<typeof organizationQuerySchema>;
