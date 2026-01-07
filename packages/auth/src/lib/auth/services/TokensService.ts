import jwt, { JwtPayload } from "jsonwebtoken";

import crypto from "crypto";
import {
  AuthDomainErrorCodesType,
  AuthenticatedErrorCodes,
} from "../errors/errors.js";
import {
  BaseRefreshToken,
  IRefreshTokenRepository,
} from "../interfaces/IRefreshTokenRepository.js";
import { generateExpiredDate, ValidTimeString } from "@khni/utils";
import { fail, ok, Result } from "@avuny/utils";

interface AccessTokenPayload extends JwtPayload {
  userId: string;
  tokenType: string;
}
export class TokensService<RefreshToken extends BaseRefreshToken> {
  private jwtTokenType = "access";
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository<RefreshToken>,
    private refreshTokenExpiresIn: ValidTimeString,
    private accessTokenSecret: string,
    private accessTokenExpiresIn: ValidTimeString
  ) {}

  issue = async ({ userId }: { userId: string }) => {
    const refreshToken = await this.refreshTokenRepository.create({
      expiresAt: generateExpiredDate(this.refreshTokenExpiresIn),
      userId,
      token: crypto.randomBytes(64).toString("hex"),
      revokedAt: null,
    });
    const payload: AccessTokenPayload = {
      userId,
      tokenType: this.jwtTokenType,
    };

    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });

    return ok({
      accessToken,
      refreshToken: refreshToken.token,
    });
  };

  verifyAccessToken = (accessToken: string) => {
    let payLoad: AccessTokenPayload;
    try {
      payLoad = jwt.verify(
        accessToken,
        this.accessTokenSecret
      ) as AccessTokenPayload;
    } catch (error) {
      return fail(AuthenticatedErrorCodes.UNAUTHENTICATED);
    }

    return ok({ userId: payLoad.userId, tokenType: payLoad.tokenType });
  };

  deleteRefreshToken = async (token: string) => {
    return await this.refreshTokenRepository.delete(token);
  };

  // not implemented yet
  private verifyRefreshToken = async ({
    token,
  }: {
    token: string;
  }): Promise<Result<{ refreshToken: string }, AuthDomainErrorCodesType>> => {
    return ok({ refreshToken: "" });
  };
}
