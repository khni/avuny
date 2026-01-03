import bcrypt from "bcryptjs";
import { Result } from "../result.js";
import {
  AuthDomainErrorCodes,
  type AuthDomainErrorCodesType,
} from "../../domain/error.js";
import { UserCreateInput, UserLoginInput } from "../interfaces/types.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";

export class LocalAuthService<User extends { hashedPassword: string }> {
  constructor(private userRepository: IUserRepository<User>) {}
  createUser = async ({
    identifier,
    password,
    name,
  }: UserCreateInput): Promise<Result<User, AuthDomainErrorCodesType>> => {
    const _user = await this.userRepository.findUnique({
      where: { identifier },
    });
    if (_user) {
      return { success: false, error: AuthDomainErrorCodes.AUTH_USER_EXIST };
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await this.userRepository.create({
      data: {
        identifier,
        name,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      data: user,
    };
  };

  verifyPassword = async ({ identifier, password }: UserLoginInput) => {
    const user = await this.userRepository.findUnique({
      where: { identifier },
    });
    if (!user) {
      return {
        success: false,
        error: AuthDomainErrorCodes.AUTH_INCORRECT_CREDENTIALS,
      };
    }
    if (!user.hashedPassword) {
      return {
        success: false,
        error: AuthDomainErrorCodes.AUTH_USER_PASSWORD_NOT_SET,
      };
    }
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
      return {
        success: false,
        error: AuthDomainErrorCodes.AUTH_INCORRECT_CREDENTIALS,
      };
    }

    return {
      success: true,
      data: user,
    };
  };
}
