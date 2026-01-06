import { LocalAuthService } from "../lib/auth/services/LocalAuthService.js";
import { TokensService } from "../lib/auth/services/TokensService.js";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";
import {
  LocalLoginInput,
  LocalRegisterInput,
  LocalRegisterWithTransformInput,
} from "../schemas.js";
import { mapAuthResponse } from "../lib/auth/utils.js";
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

  return mapAuthResponse(authResult, tokensResult);
};

export const signIn = async ({
  identifier,

  password,
}: LocalLoginInput) => {
  const authResult = await localAuthservce.verifyPassword({
    identifier,
    password,
  });

  if (!authResult.success) {
    return authResult;
  }

  const tokensResult = await tokensService.issue({
    userId: authResult.data.id,
  });

  return mapAuthResponse(authResult, tokensResult);
};
