import { ok } from "../lib/result.js";
import { LocalAuthService } from "../lib/services/LocalAuthService.js";
import { TokensService } from "../lib/services/TokensService.js";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";
import {
  LocalRegisterInput,
  LocalRegisterWithTransformInput,
} from "../schemas.js";
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("jwtSecret is not defined in .env file");
}
const localAuthservce = new LocalAuthService(new UserRepository("email"));

const tokensService = new TokensService(
  new RefreshTokenRepository(),
  "15d",
  jwtSecret,
  "5m"
);
export const signUp = async ({
  identifier,
  name,
  password,
}: LocalRegisterWithTransformInput) => {
  const authResult = await localAuthservce.createUser({
    identifier: identifier.value,
    name,
    password,
  });

  if (!authResult.success) {
    return authResult;
  }

  const tokensResult = await tokensService.issue({
    userId: authResult.data.id,
  });

  return ok({
    user: {
      id: authResult.data.id,
      name: authResult.data.name,
      identifier: authResult.data.email,
    },
    tokens: {
      accessToken: tokensResult.data.accessToken,
      refreshToken: tokensResult.data.refreshToken,
    },
  });
};
