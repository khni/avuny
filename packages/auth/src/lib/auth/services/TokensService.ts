import jwt from "jsonwebtoken";
import { ok, Result } from "../../result.js";
import crypto from "crypto";
import { AuthDomainErrorCodesType } from "../errors/errors.js";
import {
  BaseRefreshToken,
  IRefreshTokenRepository,
} from "../interfaces/IRefreshTokenRepository.js";
import { generateExpiredDate, ValidTimeString } from "@khni/utils";
export class TokensService<RefreshToken extends BaseRefreshToken> {
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

    const accessToken = jwt.sign(
      { userId, tokenType: "access" },
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiresIn }
    );

    return ok({
      accessToken,
      refreshToken: refreshToken.token,
    });
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
