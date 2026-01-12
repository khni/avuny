import { Prisma, PrismaClient } from "@avuny/db";
import {
  CreateOrganizationInput,
  type Organization,
  OrganizationWhereUniqueInput,
  UpdateOrganizationInput,
} from "./schemas.js";

type Tx = Prisma.TransactionClient;

export class OrganizationService {
  constructor(private readonly db: PrismaClient) {}

  private getDB(tx?: Tx) {
    return tx ?? this.db;
  }

  async create(data: CreateOrganizationInput, tx?: Tx): Promise<Organization> {
    const _db = this.getDB(tx);

    return _db.organization.create({
      data,
    });
  }

  async update(
    where: OrganizationWhereUniqueInput,
    data: UpdateOrganizationInput,
    tx?: Tx
  ): Promise<Organization> {
    const _db = this.getDB(tx);

    return _db.organization.update({
      where,
      data,
    });
  }

  async findUnique(
    where: OrganizationWhereUniqueInput,
    tx?: Tx
  ): Promise<Organization | null> {
    const _db = this.getDB(tx);

    return _db.organization.findUnique({
      where,
    });
  }

  async findMany(userId: string, tx?: Tx): Promise<Organization[]> {
    const _db = this.getDB(tx);

    return _db.organization.findMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
