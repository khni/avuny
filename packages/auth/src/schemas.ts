import { z } from "@hono/zod-openapi";

// ─────────────────────────────────────────────
// localRegisterInputSchema
// ─────────────────────────────────────────────
export const localRegisterInputSchema = z
  .object({
    email: z.string().openapi({ example: "john@example.com" }),
    password: z.string().openapi({ example: "P@ssw0rd" }),
    name: z.string().openapi({ example: "John Doe" }),
  })
  .openapi("LocalRegisterInput");

// ─────────────────────────────────────────────
// otpSignUpInputSchema
// ─────────────────────────────────────────────
export const otpSignUpInputSchema = z
  .object({
    password: z.string().openapi({ example: "P@ssw0rd" }),
    name: z.string().openapi({ example: "John Doe" }),
  })
  .openapi("OtpSignUpInput");

// ─────────────────────────────────────────────
// localLoginInputSchema
// ─────────────────────────────────────────────
export const localLoginInputSchema = z
  .object({
    identifier: z.string().openapi({ example: "john@example.com" }),
    password: z.string().openapi({ example: "P@ssw0rd" }),
  })
  .openapi("LocalLoginInput");

// ─────────────────────────────────────────────
// resetForgettenPasswordInputSchema
// ─────────────────────────────────────────────
export const resetForgettenPasswordInputSchema = z
  .object({
    newPassword: z.string().openapi({ example: "NewStrongPassword123" }),
    confirmNewPassword: z.string().openapi({ example: "NewStrongPassword123" }),
  })
  .openapi("ResetForgottenPasswordInput");

// ─────────────────────────────────────────────
// refreshTokenInputSchema
// ─────────────────────────────────────────────
export const refreshTokenInputSchema = z
  .object({
    refreshToken: z
      .string()
      .optional()
      .openapi({ example: "jwt-refresh-token" }),
  })
  .openapi("RefreshTokenInput");

// ─────────────────────────────────────────────
// refreshTokenResponseSchema
// ─────────────────────────────────────────────
export const refreshTokenResponseSchema = z
  .object({
    accessToken: z.string().openapi({ example: "jwt-access-token" }),
  })
  .openapi("RefreshTokenResponse");

// ─────────────────────────────────────────────
// otpTypeSchema (any)
// ─────────────────────────────────────────────
export const otpTypeSchema = z.any().openapi({
  description: "OTP type (e.g. 'email_verification', 'password_reset')",
  example: "email_verification",
});

// ─────────────────────────────────────────────
// createOtpBodyTypeSchema
// ─────────────────────────────────────────────
export const createOtpBodyTypeSchema = z
  .object({
    email: z.string().openapi({ example: "john@example.com" }),
    type: otpTypeSchema,
  })
  .openapi("CreateOtpBody");

// ─────────────────────────────────────────────
// verifyOtpBodyTypeSchema
// ─────────────────────────────────────────────
export const verifyOtpBodyTypeSchema = z
  .object({
    email: z.string().openapi({ example: "john@example.com" }),
    type: otpTypeSchema,
    otp: z.string().openapi({ example: "123456" }),
  })
  .openapi("VerifyOtpBody");

// ─────────────────────────────────────────────
// socialLoginParamsTypeSchema
// ─────────────────────────────────────────────
export const socialLoginParamsTypeSchema = z
  .object({
    code: z.string().openapi({ example: "oauth-google-auth-code" }),
  })
  .openapi("SocialLoginParams");

// ─────────────────────────────────────────────
// userResponseTypeSchema
// ─────────────────────────────────────────────
export const userResponseTypeSchema = z
  .object({
    id: z.string().openapi({ example: "user_123" }),
    name: z.string().openapi({ example: "John Doe" }),
    identifier: z.string().openapi({ example: "john@example.com" }),
    identifierType: z
      .union([z.literal("email"), z.literal("phone")])
      .openapi({ example: "email" }),
  })
  .openapi("UserResponse");

// ─────────────────────────────────────────────
// authTokensResponseTypeSchema
// ─────────────────────────────────────────────
export const authTokensResponseTypeSchema = z
  .object({
    accessToken: z.string().openapi({ example: "jwt-access-token" }),
    refreshToken: z.string().openapi({ example: "jwt-refresh-token" }),
  })
  .openapi("AuthTokensResponse");

// ─────────────────────────────────────────────
// authResponseTypeSchema
// ─────────────────────────────────────────────
export const authResponseTypeSchema = z
  .object({
    user: userResponseTypeSchema,
    tokens: authTokensResponseTypeSchema,
  })
  .openapi("AuthResponse");
