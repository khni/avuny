import { prisma, type Prisma, Tx, DB, PrismaTransaction } from "@avuny/db";

export class RoleRepository extends PrismaTransaction {
  constructor(private readonly db: DB = prisma) {
    super();
  }

  private getDB(tx?: Tx): DB {
    return tx ?? this.db;
  }

  /** Create activity log */
  async create(params: {
    data: Prisma.RoleCreateManyInput & {
      permissions: { permissionId: string }[];
    };

    tx?: Tx;
  }) {
    const { data, tx } = params;
    const { permissions, ...role } = data;
    const db = this.getDB(tx);

    return db.role.create({
      data,
      select: { id: true, name: true },
    });
  }

  /** Find activity log by ID */
  async findUnique(params: { where: Prisma.RoleWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.role.findUnique({
      where,
    });
  }

  /** Find many activity logs */
  async findMany(params?: {
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
    skip?: number;
    take?: number;
    tx?: Tx;
  }) {
    const { tx, ...query } = params ?? {};
    const db = this.getDB(tx);

    return db.role.findMany({
      ...query,
    });
  }

  /** Update activity log */
  async update(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
    tx?: Tx;
  }) {
    const { where, data, tx } = params;
    const db = this.getDB(tx);

    return db.role.update({
      where,
      data,
    });
  }

  /** Delete activity log */
  async delete(params: { where: Prisma.RoleWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.role.delete({
      where,
      select: { id: true },
    });
  }

  /** Count activity logs */
  async count(params?: { where?: Prisma.RoleWhereInput; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.role.count({ where });
  }

  /** Create many activity logs */
  async createMany(params: {
    data: Prisma.RoleCreateManyInput[];
    skipDuplicates?: boolean;
    tx?: Tx;
  }) {
    const { data, skipDuplicates, tx } = params;
    const db = this.getDB(tx);

    return db.role.createMany({
      data,
      skipDuplicates,
    });
  }
}
