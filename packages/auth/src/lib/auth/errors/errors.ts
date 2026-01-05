// src/domain/errors.ts
export const AuthLoginDomainErrorCodes = {
  AUTH_LOGIN_INCORRECT_CREDENTIALS: "AUTH_LOGIN_INCORRECT_CREDENTIALS",
  AUTH_LOGIN_USER_PASSWORD_NOT_SET: "AUTH_LOGIN_USER_PASSWORD_NOT_SET",
} as const;
export type AuthLoginDomainErrorCodesType =
  (typeof AuthLoginDomainErrorCodes)[keyof typeof AuthLoginDomainErrorCodes];

export const AuthSignUpDomainErrorCodes = {
  AUTH_SIGN_UP_USER_EXIST: "AUTH_SIGN_UP_USER_EXIST",
} as const;
export type AuthSignUpDomainErrorCodesType =
  (typeof AuthSignUpDomainErrorCodes)[keyof typeof AuthSignUpDomainErrorCodes];

export const AuthDomainErrorCodes = {
  ...AuthLoginDomainErrorCodes,
  ...AuthSignUpDomainErrorCodes,
} as const;
export type AuthDomainErrorCodesType =
  | AuthLoginDomainErrorCodesType
  | AuthSignUpDomainErrorCodesType;
