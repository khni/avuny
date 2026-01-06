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
import { fail, ok } from "@avuny/utils";
import { AuthenticatedErrorCodes } from "../lib/auth/errors/errors.js";
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("jwtSecret is not defined in .env file");
}
const userRepository = new UserRepository("email");
const localAuthservce = new LocalAuthService(userRepository);

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

// token may be undefiend or null if it did not attack to header
export const isAuthenticated = (token?: string | null) => {
  if (!token) {
    return fail(AuthenticatedErrorCodes.UNAUTHENTICATED);
  }
  return tokensService.verifyAccessToken(token);
};

export const getUser = async (id: string) => {
  const user = await userRepository.findUnique({ where: { id } });
  if (!user) {
    //this function will be used by isAuthenticated route
    return fail(AuthenticatedErrorCodes.UNAUTHENTICATED);
  }

  return ok({ id: user.id, identifier: user.email, name: user.name });
};
