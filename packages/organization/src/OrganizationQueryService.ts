import { prisma, Prisma, PrismaClient } from "@avuny/db";
import {
  GetOrganizationByIdParams,
  GetOrganizationByIdResponse,
  OrganizationListResponse,
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
    where: GetOrganizationByIdParams;
    ownerId: string;
    tx?: Tx;
  }): Promise<GetOrganizationByIdResponse | null> {
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
  }): Promise<OrganizationListResponse[]> {
    const _db = this.getDB(tx);

    return await _db.organization.findMany({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
      },
    });
  }
}
