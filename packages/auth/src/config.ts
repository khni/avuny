import { authTokensConfig } from "@khni/auth";
import { prisma } from "@repo/db";
import { RefreshTokenRepository } from "./repositories/RefreshTokenRepository.js";
authTokensConfig.set({
  accessTokenExpiresIn: "15m",
  jwtSecret: "dev-secret",
  refreshTokenExpiresIn: "15d",
  logger: console,
  findUniqueUserById: prisma.user.findUnique.bind(prisma.user),
  refreshTokenRepository: new RefreshTokenRepository(),
});
