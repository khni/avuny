import z, { email } from "zod";
import { localRegisterInputSchema } from "../schemas.js";
import { prisma } from "@avuny/db";
import { IUserRepository } from "../lib/interfaces/IUserRepository.js";
import { OauthProvider, User } from "@avuny/db/types";
import { FindUserWhere, UserCreateInput } from "../lib/interfaces/types.js";

export class UserRepository implements IUserRepository<User> {
  async findUnique({ where }: { where: FindUserWhere }): Promise<User | null> {
    if ("id" in where) {
      return prisma.user.findUnique({
        where: { id: where.id },
      });
    }
    if ("identifier" in where) {
      return prisma.user.findUnique({
        where: { email: where.identifier },
      });
    }
    return null;
  }
  async create({ data }: { data: UserCreateInput }): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.identifier,
        name: data.name,
        password: data.password,
      },
    });
  }
}
