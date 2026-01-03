import jwt from "jsonwebtoken";
import { Result } from "../result.js";
import crypto from "crypto";
import { AuthDomainErrorCodesType } from "../../domain/error.js";
import {
  BaseRefreshToken,
  CreateTokensInput,
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

  issue = async ({
    userId,
  }: CreateTokensInput): Promise<
    Result<{ accessToken: string; refreshToken: string }>
  > => {
    const refreshToken = await this.refreshTokenRepository.create({
      expiresAt: generateExpiredDate(this.refreshTokenExpiresIn),
      userId,
      token: crypto.randomBytes(64).toString("hex"),
      revokedAt: null,
    });

    const accessToken = jwt.sign(
      { userId, tokenype: "access" },
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiresIn }
    );
    return {
      success: true,
      data: { accessToken, refreshToken: refreshToken.token },
    };
  };

  //not implemented yet
  private verifyRefreshToken = async ({
    token,
  }: {
    token: string;
  }): Promise<Result<{ refreshToken: string }, AuthDomainErrorCodesType>> => {
    return {
      success: true,
      data: { refreshToken: "" },
    };
  };
}
