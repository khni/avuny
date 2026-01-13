import { prisma, Prisma, PrismaClient } from "@avuny/db";
import {
  CreateOrganizationInput,
  type Organization,
  OrganizationWhereUniqueInput,
  UpdateOrganizationInput,
} from "./schemas.js";
import { nameConflict, ok } from "@avuny/utils";

type Tx = Prisma.TransactionClient;

export class OrganizationMutationService {
  constructor(private readonly db: PrismaClient) {}

  private getDB(tx?: Tx) {
    return tx ?? this.db;
  }

  async create({
    data,
    ownerId, // because it will be taken from authenticated user id
    tx,
  }: {
    data: CreateOrganizationInput;
    ownerId: string;
    tx?: Tx;
  }) {
    const _db = this.getDB(tx);
    let organization = await _db.organization.findUnique({
      where: {
        name_ownerId: {
          name: data.name,
          ownerId: ownerId,
        },
      },
    });
    if (organization) {
      return nameConflict();
    }

    organization = await _db.organization.create({
      data: {
        ...data,
        ownerId,
      },
    });
    return ok(organization);
  }

  async update({
    data,
    where,
    ownerId,
    tx,
  }: {
    where: OrganizationWhereUniqueInput;
    ownerId: string;
    data: UpdateOrganizationInput;
    tx?: Tx;
  }): Promise<Organization> {
    const _db = this.getDB(tx);

    return await _db.organization.update({
      where: { ...where, ownerId },
      data,
    });
  }

  async delete({
    ownerId,
    where,
    tx,
  }: {
    ownerId: string;
    where: OrganizationWhereUniqueInput;
    tx?: Tx;
  }): Promise<Organization> {
    const _db = this.getDB(tx);

    return await _db.organization.delete({
      where: { ...where, ownerId },
    });
  }
}
