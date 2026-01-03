// src/domain/errors.ts
export const AuthDomainErrorCodes = {
  AUTH_USER_EXIST: "AUTH_USER_EXIST",
  AUTH_UNVERIFIED_EMAIL: "AUTH_UNVERIFIED_EMAIL",
  AUTH_INCORRECT_CREDENTIALS: "AUTH_INCORRECT_CREDENTIALS",
  AUTH_USER_PASSWORD_NOT_SET: "AUTH_USER_PASSWORD_NOT_SET",
} as const;
export type AuthDomainErrorCodesType =
  (typeof AuthDomainErrorCodes)[keyof typeof AuthDomainErrorCodes];
