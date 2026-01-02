import {
  BcryptjsHasher,
  getAuthTokensService,
  ILocalAuthService,
  LocalAuthService,
} from "@khni/auth";
import { UserRepository } from "../repositories/UserRepository.js";
import { UserType } from "../repositories/types.js";
import { LocalLoginInput, LocalRegisterInput } from "@workspace/shared";

export class AuthService {
  private localAuthService: ILocalAuthService<UserType> = new LocalAuthService(
    new UserRepository()
  );
  private authTokenService = getAuthTokensService();

  login = async (data: LocalLoginInput) => {
    const { password, ...user } = await this.localAuthService.verifyPassword({
      data: {
        password: data.password,
        identifier: data.identifier,
      },
    });
    const tokens = await this.authTokenService.generate(user.id);

    return { user, tokens };
  };

  register = async ({ data }: { data: LocalRegisterInput }) => {
    const { password, ...user } = await this.localAuthService.createUser({
      data,
    });
    const tokens = await this.authTokenService.generate(user.id);

    return { user, tokens };
  };
}
export const authService = new AuthService();
