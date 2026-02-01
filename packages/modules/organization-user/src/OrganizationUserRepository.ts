import { prisma, type Prisma, Tx, DB } from "@avuny/db";
import { CreateOrganizationUserBody } from "./types.js";

export class OrganizationUserRepository {
  constructor(private readonly db: DB = prisma) {}

  private getDB(tx?: Tx): DB {
    return tx ?? this.db;
  }

  /** Create organization user */
  async create(params: {
    data: CreateOrganizationUserBody & { organizationId: string };
    tx?: Tx;
  }) {
    const { data, tx } = params;
    const db = this.getDB(tx);

    return await db.organizationUser.create({
      data,
      select: { id: true },
    });
  }

  /** Find organization user by ID */
  async findById(params: { id: string; tx?: Tx }) {
    const { id, tx } = params;
    const db = this.getDB(tx);

    return await db.organizationUser.findUnique({
      where: { id },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  /** Find organization user by userId and organizationId */
  async findByOrganizationIdAndUserId(params: {
    userId: string;
    organizationId: string;
    tx?: Tx;
  }) {
    const { userId, organizationId, tx } = params;
    const db = this.getDB(tx);

    return await db.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });
  }

  /** Find organization user by userId and organizationId */
  async findByOrganizationIdAndName(params: {
    name: string;
    organizationId: string;
    tx?: Tx;
  }) {
    const { name, organizationId, tx } = params;
    const db = this.getDB(tx);

    return await db.organizationUser.findUnique({
      where: {
        name_organizationId: {
          name,
          organizationId,
        },
      },
    });
  }

  /** Find many organization users */
  async findMany(params?: {
    where?: Prisma.OrganizationUserWhereInput;
    orderBy?: Prisma.OrganizationUserOrderByWithRelationInput;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return await db.organizationUser.findMany({
      ...query,
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  /** Update organization user */
  async update(params: {
    where: Prisma.OrganizationUserWhereUniqueInput;
    data: Prisma.OrganizationUserUpdateInput;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return await db.organizationUser.update({
      where,
      data,
    });
  }

  /** Delete organization user */
  async delete(params: {
    where: Prisma.OrganizationUserWhereUniqueInput;
    tx?: Tx;
  }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return await db.organizationUser.delete({
      where,
      select: { id: true },
    });
  }

  /** Count organization users */
  async count(params?: { where?: Prisma.OrganizationUserWhereInput; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return await db.organizationUser.count({ where });
  }

  /** Create many organization users */
  async createMany(params: {
    data: Prisma.OrganizationUserCreateManyInput[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }) {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return await db.organizationUser.createMany({
      data,
      skipDuplicates,
    });
  }
}
