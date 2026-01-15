import { prisma, Prisma, PrismaClient } from "@avuny/db";
import {
  CreateOrganizationInput,
  type Organization,
  OrganizationWhereUniqueInput,
  UpdateOrganizationInput,
} from "./types.js";

type Tx = Prisma.TransactionClient;

export class OrganizationQueryService {
  constructor(private readonly db: PrismaClient) {}

  private getDB(tx?: Tx) {
    return tx ?? this.db;
  }

  async findUnique({
    where,
    ownerId,
    tx,
  }: {
    where: OrganizationWhereUniqueInput;
    ownerId: string;
    tx?: Tx;
  }): Promise<Organization | null> {
    const _db = this.getDB(tx);

    return _db.organization.findUnique({
      where: { ...where, ownerId },
    });
  }

  async findMany({
    ownerId,
    tx,
  }: {
    ownerId: string;
    tx?: Tx;
  }): Promise<Organization[]> {
    const _db = this.getDB(tx);

    return await _db.organization.findMany({
      where: {
        ownerId,
      },
    });
  }
}
