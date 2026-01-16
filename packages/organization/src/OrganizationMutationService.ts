import { prisma, Prisma, PrismaClient } from "@avuny/db";
import {
  CreateOrganizationBody,
  GetOrganizationByIdParams,
  UpdateOrganizationBody,
  type Organization,
} from "./types.js";
import { nameConflict, ok, creationLimitExceeded } from "@avuny/utils";

type Tx = Prisma.TransactionClient;

export class OrganizationMutationService {
  constructor(
    private readonly db: PrismaClient,
    private creationLimit: number = 3
  ) {}

  private getDB(tx?: Tx) {
    return tx ?? this.db;
  }

  async create({
    data,
    ownerId, // because it will be taken from authenticated user id
    tx,
  }: {
    data: CreateOrganizationBody;
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
      select: {
        id: true,
        name: true,
      },
    });
    if (organization) {
      return nameConflict();
    }

    const organizationListCount = await _db.organization.count({
      where: {
        ownerId,
      },
    });
    if (organizationListCount >= this.creationLimit) {
      return creationLimitExceeded();
    }
    organization = await _db.organization.create({
      data: {
        ...data,
        ownerId,
      },
      select: {
        id: true,
        name: true,
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
    where: GetOrganizationByIdParams;
    ownerId: string;
    data: UpdateOrganizationBody;
    tx?: Tx;
  }) {
    const _db = this.getDB(tx);
    let organization = await _db.organization.findFirst({
      where: {
        name: data.name,
        ownerId: {
          not: ownerId,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (organization) {
      return nameConflict();
    }

    organization = await _db.organization.update({
      where: { ...where, ownerId },
      data,
    });
    return ok(organization);
  }

  async delete({
    ownerId,
    where,
    tx,
  }: {
    ownerId: string;
    where: GetOrganizationByIdParams;
    tx?: Tx;
  }): Promise<Organization> {
    const _db = this.getDB(tx);

    return await _db.organization.delete({
      where: { ...where, ownerId },
    });
  }
}
