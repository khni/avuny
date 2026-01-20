import { prisma, type Prisma, Tx, DB, PrismaTransaction } from "@avuny/db";
import { IBaseRepository } from "@avuny/core";
// export type WhereUniqueInput =
//   | { id: string }
//   | { organizationId_name: { name: string; organizationId: string } };
//    IBaseRepository<
//       Tx,
//       Role,
//       Prisma.RoleCreateManyInput & {
//         permissions: { permissionId: string }[];
//       },
//       WhereUniqueInput
//     >
// : Promise<
//     | Fail<"MODULE_NAME_CONFLICT">
//     | Fail<"MODULE_CREATION_LIMIT_EXCEEDED">
//     | Ok<Awaited<ReturnType<R["update"]>>>
//   >
export class RoleRepository
  extends PrismaTransaction
  implements IBaseRepository
{
  constructor(private readonly db: DB = prisma) {
    super();
  }

  private getDB(tx?: Tx): DB {
    return tx ?? this.db;
  }

  /** Create role*/
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
      select: { id: true, name: true, description: true },
    });
  }

  /** Find roleby ID */
  async findUnique(params: { where: Prisma.RoleWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.role.findUnique({
      where,
    });
  }

  /** Find many roles */
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

  /** Update role*/
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
      select: { id: true, name: true, description: true },
    });
  }

  /** Delete role*/
  async delete(params: { where: Prisma.RoleWhereUniqueInput; tx?: Tx }) {
    const { where, tx } = params;
    const db = this.getDB(tx);

    return db.role.delete({
      where,
      select: { id: true },
    });
  }

  /** Count roles */
  async count(params?: { where?: Prisma.RoleWhereInput; tx?: Tx }) {
    const { tx, where } = params ?? {};
    const db = this.getDB(tx);

    return db.role.count({ where });
  }

  /** Create many roles */
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
